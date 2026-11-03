import { selectedSkillsMenuKeyboard, skillBookStartKeyboard } from "../../../bot/keyboards/skills"
import DuelistService from "../../../db/services/duel/DuelistService"
import LevelService from "../../../db/services/level/LevelService"
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
        attack = SkillAttack.Normal
    }: GetSkillMethodsDataOptions): Promise<number[]> {
        const caster = ctx.vars.id
        const duel = await ctx.vars.duel.get()
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
            },
            target: {
                id: target,
                level: new LazyValue(() => LevelService.get(chatId, target)),
                user: new LazyValue(() => UserService.get(chatId, target)),
                duelist: new LazyValue(() => DuelistService.get(chatId, target)),
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