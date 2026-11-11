import type Duel from "../../../db/entities/duel/Duel"
import { SkillAttack } from "../../../protos/duels_pb"
import type { BotContext } from "../../../types/bot"
import type { MethodParticipant } from "../../../types/skill-methods"
import RandomUtils from "../../math/RandomUtils"
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
        inUseSkillMethod?: boolean
        skill: Skill
        target: MethodParticipant
        caster: MethodParticipant
        ctx: BotContext
    }

type ExecuteResult =
    | {
        ok: false
        failKey: string
    }
    | {
        ok: true
        datas: {
            caster: number[]
            target: number[]
        }
        attack: SkillAttack
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
            duel,
        } = options

        let i = 0
        for (const method of methods) {
            const methodResult = await method.precheck({
                caster,
                target,
                chatId,
                ctx,
                data: datas[i++]!,
                duel,
            })
            if (!methodResult) {
                return method.getFailText()
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
            target,
            caster,
            inUseSkillMethod = false
        } = options

        const {
            methods: {
                caster: casterMethods,
                target: targetMethods
            }
        } = skill
        if (casterMethods.length + targetMethods.length <= 0) {
            return {
                ok: true,
                datas: {
                    caster: [],
                    target: []
                },
                attack: SkillAttack.Normal
            }
        }

        const duel = await ctx.vars.duel.duel.get()
        if (!duel) {
            return {
                ok: false,
                failKey: 'duel/message/not-exist'
            }
        }

        const chatId = ctx.vars.chatId!
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
                failKey: casterPrecheckResult
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
                failKey: targetPrecheckResult
            }
        }

        await Promise.all([
            ...casterMethods.map(async (method, i) => {
                return await method.execute({
                    chatId,
                    caster,
                    target: caster,
                    ctx,
                    duel,
                    data: targetDatas[i]!,
                    inUseSkillMethod
                })
            }),
            ...targetMethods.map(async (method, i) => {
                return await method.execute({
                    chatId,
                    caster,
                    target,
                    ctx,
                    duel,
                    data: targetDatas[i]!,
                    inUseSkillMethod
                })
            })
        ])

        return {
            ok: true,
            datas: {
                caster: casterDatas,
                target: targetDatas
            },
            attack
        }
    }
}