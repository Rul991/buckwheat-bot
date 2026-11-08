import { backFightDuelKeyboard } from "../../../bot/keyboards/duel"
import { selectedSkillsMenuKeyboard, skillBookStartKeyboard } from "../../../bot/keyboards/skills"
import DuelistService from "../../../db/services/duel/DuelistService"
import LevelService from "../../../db/services/level/LevelService"
import BalanceService from "../../../db/services/money/BalanceService"
import UserService from "../../../db/services/user/UserService"
import { SkillAttack } from "../../../protos/duels_pb"
import type { BotContext } from "../../../types/bot"
import type { SkillMethodGetTextShowType } from "../../../types/skill-methods"
import LazyValue from "../../cache/LazyValue"
import DuelUtils from "../duel/DuelUtils"
import type SkillMethod from "../methods/base/SkillMethod"
import type Skill from "./Skill"
import SkillExecutor from "./SkillExecutor"

type GetSkillMethodsDataOptions = {
    ctx: BotContext
    methods: SkillMethod[]
    attack?: SkillAttack
    datas?: number[]
}

type GetSkillMethodsTextOptions =
    & GetSkillMethodsDataOptions
    & {
        type: SkillMethodGetTextShowType
    }

type ShowOptions = {
    ctx: BotContext
    skill: Skill
    showType: SkillMethodGetTextShowType
    attack?: SkillAttack
}

type AttackOptions =
    & Required<Omit<ShowOptions, 'showType'>>
    & {
        casterDatas?: number[]
        targetDatas?: number[]
    }

export default class SkillPresenter {
    static async menu(ctx: BotContext) {
        const user = await ctx.vars.user.require()
        const className = user.className
        const id = user.id

        return {
            key: 'skills/message/menu',
            options: {
                vars: {
                    className
                },
                keyboard: await selectedSkillsMenuKeyboard(
                    ctx,
                    {
                        id
                    }
                )
            }
        }
    }

    private static async _getSkillMethodsData({
        ctx,
        methods,
        attack = SkillAttack.Normal,
        datas
    }: GetSkillMethodsDataOptions): Promise<number[]> {
        if (datas) {
            return datas
        }
        const caster = ctx.vars.id
        const duel = await ctx.vars.duel.duel.get()
        if (!duel) {
            return []
        }

        const target = DuelUtils.getEnemy(
            duel,
            caster
        )
        const chatId = duel.chatId

        return await SkillExecutor.getData({
            attack,
            duel,
            methods,
            chatId,
            ctx,
            caster: {
                id: caster,
                level: ctx.vars.level,
                user: ctx.vars.user,
                duelist: ctx.vars.duelist,
                balance: ctx.vars.balance
            },
            target: {
                id: target,
                level: new LazyValue(() => LevelService.getCurrentLevel(chatId, target)),
                user: new LazyValue(() => UserService.get(chatId, target)),
                duelist: new LazyValue(() => DuelistService.get(chatId, target)),
                balance: new LazyValue(() => BalanceService.get(chatId, target))
            }
        })
    }

    private static async _getSkillMethodsText(options: GetSkillMethodsTextOptions) {
        const datas = await this._getSkillMethodsData(options)
        const {
            ctx,
            type: showType
        } = options

        return options.methods.map((method, i) => {
            return method.getSuccessText({
                data: datas[i] || 0,
                ctx,
                showType
            })
        })
    }

    static async show(options: ShowOptions) {
        const {
            ctx,
            skill,
            showType,
            attack
        } = options

        return {
            key: 'skills/message/show',
            vars: {
                skill: {
                    ...skill,
                    ...skill.getVars(ctx)
                },
                casterMethods: await this._getSkillMethodsText({
                    ctx,
                    methods: skill.methods.caster,
                    type: showType,
                    attack
                }),
                targetMethods: await this._getSkillMethodsText({
                    ctx,
                    methods: skill.methods.target,
                    type: showType,
                    attack
                }),
            }
        }
    }

    static async attack(options: AttackOptions) {
        const {
            ctx,
            skill,
            attack,
            casterDatas,
            targetDatas
        } = options

        const type = 'attack'
        const chatId = ctx.vars.chatId!

        const nextDuelistId = await ctx.vars.duel.currentDuelist.get()
        const next = await UserService.get(chatId, nextDuelistId)

        return {
            key: 'skills/message/attack',
            options: {
                vars: {
                    skill: skill.getTitle(ctx),
                    casterMethods: await this._getSkillMethodsText({
                        ctx,
                        methods: skill.methods.caster,
                        type,
                        attack,
                        datas: casterDatas,
                    }),
                    targetMethods: await this._getSkillMethodsText({
                        ctx,
                        methods: skill.methods.target,
                        type,
                        attack,
                        datas: targetDatas,
                    }),
                    attack,
                    next,
                },
                keyboard: await backFightDuelKeyboard(ctx, { key: 'duel/button/fight' }),
                chatId
            }
        }
    }

    static async bookMenu(ctx: BotContext) {
        const id = ctx.vars.id
        return {
            key: 'skills/message/book/menu',
            options: {
                keyboard: await skillBookStartKeyboard(
                    ctx,
                    {
                        id
                    }
                )
            }
        }
    }
}