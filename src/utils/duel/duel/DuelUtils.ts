import type Duel from "../../../db/entities/duel/Duel"
import DuelService from "../../../db/services/duel/DuelService"
import type { BotContext } from "../../../types/bot"
import AdminUtils from "../../bot/AdminUtils"
import MessageUtils from "../../bot/MessageUtils"
import Logger from "../../logs/Logger"
import MathUtils from "../../math/MathUtils"
import DuelPresenter from "./DuelPresenter"

type EndOptions = {
    duel: Duel
    loser: number
    ctx: BotContext
    isDelete: boolean
    isKick: boolean
}

export default class DuelUtils {
    static getEnemy(duel: Duel, currentDuelist: number): number {
        const index = duel.duelists.indexOf(currentDuelist)
        const newIndex = MathUtils.wrap(
            index + 1,
            0,
            duel.duelists.length - 1
        )

        Logger.debug(
            'DuelUtils.getEnemy',
            {
                index,
                newIndex,
                duelists: duel.duelists,
                currentDuelist
            }
        )
        return duel.duelists[newIndex]!
    }

    static onDuel(duel: Duel, id: number): boolean {
        return duel.duelists.indexOf(id) !== -1
    }

    static async end({
        duel,
        loser,
        ctx,
        isDelete,
        isKick
    }: EndOptions) {
        const chatId = duel.chatId
        const winner = DuelUtils.getEnemy(duel, loser)
        const {
            experience,
            prize
        } = await DuelService.end(chatId, winner)

        const {
            key,
            options: messageOptions
        } = await DuelPresenter.end({
            winner,
            loser,
            prize,
            experience,
            ctx
        })

        await Promise.all([
            isDelete && MessageUtils.deleteMessages(ctx),
            MessageUtils.reply(
                ctx,
                key,
                messageOptions
            ),
            isKick && AdminUtils.gameKick({
                ctx,
                chatId,
                id: loser,
            })
        ])
    }
}