import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type DuelAwayButtonData, DuelAwayButtonDataSchema } from "../../../../protos/duels_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import DuelService from "../../../../db/services/duel/DuelService"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import DuelUtils from "../../../../utils/duel/duel/DuelUtils"
import DuelPresenter from "../../../../utils/duel/duel/DuelPresenter"

class DuelAwayButton extends CallbackQueryAction<DuelAwayButtonData> {
    override schema: GenMessage<DuelAwayButtonData> = DuelAwayButtonDataSchema
    override defaultTextKey: string = 'duel/button/away'
    override minimumRank: number = RankUtils.min
    override settingId: number = 193
    override name: string = 'duelaway'
    
    protected override async _getId(options: CallbackQueryActionOptions<DuelAwayButtonData>): Promise<number | number[] | undefined> {
        const {
            ctx,
        } = options
        const duel = await ctx.vars.duel.get()
        return duel?.duelists.map(v => Number(v))
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<DuelAwayButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            ctx,
            chatId,
            id
        } = options

        const duel = await ctx.vars.duel.require()
        const winner = DuelUtils.getEnemy(duel, id)

        const {
            experience,
            prize
        } = await DuelService.end(chatId, winner)

        const {
            key,
            options: messageOptions
        } = await DuelPresenter.end({
            winner,
            loser: id,
            prize,
            experience,
            ctx
        })

        await Promise.all([
            MessageUtils.deleteMessages(ctx),
            MessageUtils.reply(
                ctx,
                key,
                messageOptions
            )
        ])
    }
}

export default new DuelAwayButton()
