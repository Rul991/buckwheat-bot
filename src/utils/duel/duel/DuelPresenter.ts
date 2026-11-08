import { duelFightKeyboard } from "../../../bot/keyboards/duel"
import type Duel from "../../../db/entities/duel/Duel"
import DuelistService from "../../../db/services/duel/DuelistService"
import DuelStepService from "../../../db/services/duel/DuelStepService"
import LevelService from "../../../db/services/level/LevelService"
import UserService from "../../../db/services/user/UserService"
import { characters } from "../../../resources/duels/characters/characters"
import type { BotContext } from "../../../types/bot"
import ClassUtils from "../../db/ClassUtils"
import DuelUtils from "./DuelUtils"

type FightOptions = {
    duel: Duel
    ctx: BotContext
}

type GetFightVarsOptions = {
    ctx: BotContext
    duel: Duel
    id: number
}

type GetUserOptions = {
    ctx: BotContext
    id: number
}

type EndOptions = {
    prize: number
    experience: number
    winner: number
    loser: number
    ctx: BotContext
}

export default class DuelPresenter {
    private static async _getFightVars({
        ctx,
        id,
        duel,
    }: GetFightVarsOptions) {
        const isCurrentDuelistClicked = ctx.vars.id == id
        const chatId = duel.chatId

        const [
            user,
            duelist,
            level
        ] = await Promise.all([
            this._getUser({ ctx, id }),
            isCurrentDuelistClicked ? ctx.vars.duelist.require() : await DuelistService.get(chatId, id),
            isCurrentDuelistClicked ? ctx.vars.level.get() : await LevelService.getCurrentLevel(chatId, id)
        ])

        const className = user?.className ?? ClassUtils.defaultClassName
        const maxChars = characters[className].getMaxCharacteristics(level)

        return {
            user,
            current: duelist,
            max: maxChars
        }
    }

    private static _getUser({
        ctx,
        id
    }: GetUserOptions) {
        const chatId = ctx.vars.chatId!
        return ctx.vars.id == id ? ctx.vars.user.get() : UserService.get(chatId, id)
    }

    static async fight({
        duel,
        ctx
    }: FightOptions) {
        const chatId = duel.chatId
        const currentDuelistId = await ctx.vars.duel.currentDuelist.get()
        const enemyDuelistId = DuelUtils.getEnemy(duel, currentDuelistId)

        const [
            steps,
            currentDuelist,
            enemyDuelist,
        ] = await Promise.all([
            DuelStepService.count(chatId),
            this._getFightVars({ ctx, id: currentDuelistId, duel }),
            this._getFightVars({ ctx, id: enemyDuelistId, duel }),
        ])

        return {
            key: 'duel/message/fight/fight',
            options: {
                vars: {
                    steps,
                    currentDuelist,
                    enemyDuelist
                },
                keyboard: await duelFightKeyboard(ctx, {})
            }
        }
    }

    static async end({
        winner: winnerId,
        loser: loserId,
        prize,
        experience,
        ctx
    }: EndOptions) {
        const winner = await this._getUser({ ctx, id: winnerId })
        const loser = await this._getUser({ ctx, id: loserId })

        return {
            key: 'duel/message/fight/ended',
            options: {
                vars: {
                    prize,
                    experience,
                    winner,
                    loser,
                }
            }
        }
    }
}