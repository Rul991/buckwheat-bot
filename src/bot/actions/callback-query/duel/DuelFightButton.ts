import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type DuelFightButtonData, DuelFightButtonDataSchema } from "../../../../protos/duels_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import DuelStepService from "../../../../db/services/duel/DuelStepService"
import DuelPresenter from "../../../../utils/duel/duel/DuelPresenter"
import MessageUtils from "../../../../utils/bot/MessageUtils"

class DuelFightButton extends CallbackQueryAction<DuelFightButtonData> {
    override schema: GenMessage<DuelFightButtonData> = DuelFightButtonDataSchema
    override defaultTextKey: string = 'duel/button/fight'
    override minimumRank: number = RankUtils.min
    override settingId: number = 194
    override name: string = 'duelfight'

    protected override async _getId(options: CallbackQueryActionOptions<DuelFightButtonData>): Promise<number | number[] | undefined> {
        const {
            ctx,
        } = options
        const duel = await ctx.vars.duel.get()
        return DuelStepService.getCurrentDuelist(duel)
    }

    protected override async _execute(options: CallbackQueryActionOptions<DuelFightButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            ctx
        } = options
        const duel = await ctx.vars.duel.require()

        const {
            key,
            options: messageOptions
        } = await DuelPresenter.fight({
            ctx,
            duel
        })

        await MessageUtils.editText(
            ctx,
            key,
            messageOptions
        )
    }
}

export default new DuelFightButton()
