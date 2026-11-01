import type Duel from "../../../db/entities/duel/Duel"
import DuelistService from "../../../db/services/duel/DuelistService"
import LevelService from "../../../db/services/level/LevelService"
import UserService from "../../../db/services/user/UserService"
import { SkillAttack } from "../../../protos/duels_pb"
import type { BotContext } from "../../../types/bot"
import type { MethodParticipant } from "../../../types/skill-methods"
import LazyValue from "../../cache/LazyValue"
import RandomUtils from "../../math/RandomUtils"
import DuelUtils from "../duel/DuelUtils"
import type SkillMethod from "../methods/base/SkillMethod"
import type Skill from "./Skill"

type GetDataOptions = {
    ctx: BotContext
    target: MethodParticipant
    caster: MethodParticipant
    methods: SkillMethod[]
    attack: SkillAttack
    duel: Duel
    chatId: number
}

type PrecheckOptions =
    & Omit<GetDataOptions, 'attack'>
    & {
        datas: number[]
    }

type ExecuteOptions =
    & {
        skill: Skill
        target: 'self' | 'enemy'
        ctx: BotContext
    }

type ExecuteResult =
    | {
        ok: false
        failText: string
    }
    | {
        ok: true
        datas: {
            caster: number[]
            target: number[]
        }
    }

export default class SkillExecutor {
    static getSkillAttack(): SkillAttack {
        const min = 1
        const max = 6
        const value = RandomUtils.range(min, max)

        if (value == min) {
            return SkillAttack.Fail
        }
        else if (value == max) {
            return SkillAttack.Crit
        }
        else {
            return SkillAttack.Normal
        }
    }

    static async precheck(options: PrecheckOptions): Promise<string | undefined> {
        const {
            datas,
            methods,
            caster,
            target,
            ctx,
            chatId,
            duel
        } = options

        let i = 0
        for (const method of methods) {
            const methodResult = await method.precheck({
                caster,
                target,
                chatId,
                ctx,
                data: datas[i++]!,
                duel
            })
            if (!methodResult) {
                return method.getFailText({
                    ctx
                })
            }
        }

        return undefined
    }

    static async getData(options: GetDataOptions): Promise<number[]> {
        const {
            ctx,
            target,
            caster,
            methods,
            attack,
            duel,
            chatId,
        } = options

        return await Promise.all(
            methods.map(async v => {
                return await v.getData({
                    attack,
                    chatId,
                    ctx,
                    duel,
                    target,
                    caster
                })
            })
        )
    }

    static async execute(options: ExecuteOptions): Promise<ExecuteResult> {
        const {
            skill,
            ctx,
            target: targetType
        } = options

        const duel = await ctx.vars.duel.get()
        if (!duel) {
            return {
                ok: false,
                failText: ctx.t('duel/message/not-exist')
            }
        }

        const {
            methods: {
                caster: casterMethods,
                target: targetMethods
            }
        } = skill

        const casterId = ctx.vars.id
        const chatId = ctx.vars.chatId!
        const targetId = targetType == 'self' ?
            casterId :
            DuelUtils.getEnemy(duel, casterId)

        const caster: MethodParticipant = {
            id: casterId,
            user: ctx.vars.user,
            duelist: ctx.vars.duelist,
            level: ctx.vars.level
        }
        const target: MethodParticipant = {
            id: targetId,
            user: new LazyValue(() => UserService.get(chatId, targetId)),
            duelist: new LazyValue(() => DuelistService.get(chatId, targetId)),
            level: new LazyValue(() => LevelService.get(chatId, targetId)),
        }

        const attack = this.getSkillAttack()

        const casterDatas = await this.getData({
            attack,
            ctx,
            duel,
            methods: casterMethods,
            target: caster,
            caster,
            chatId
        })

        const casterPrecheckResult = await this.precheck({
            caster,
            target: caster,
            chatId,
            ctx,
            datas: casterDatas,
            duel,
            methods: casterMethods,
        })
        if (casterPrecheckResult) {
            return {
                ok: false,
                failText: casterPrecheckResult
            }
        }

        const targetDatas = await this.getData({
            attack,
            ctx,
            duel,
            methods: targetMethods,
            target,
            caster,
            chatId
        })
        const targetPrecheckResult = await this.precheck({
            caster,
            target,
            chatId,
            ctx,
            datas: targetDatas,
            duel,
            methods: targetMethods,
        })

        if (targetPrecheckResult) {
            return {
                ok: false,
                failText: targetPrecheckResult
            }
        }

        let i = 0
        for (const method of casterMethods) {
            await method.execute({
                chatId,
                caster,
                target: caster,
                ctx,
                duel,
                data: casterDatas[i++]!
            })
        }

        i = 0
        for (const method of targetMethods) {
            await method.execute({
                chatId,
                caster,
                target,
                ctx,
                duel,
                data: targetDatas[i++]!
            })
        }

        return {
            ok: true,
            datas: {
                caster: casterDatas,
                target: targetDatas
            }
        }
    }
}