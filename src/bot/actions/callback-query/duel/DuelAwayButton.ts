import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type DuelAwayButtonData, DuelAwayButtonDataSchema } from "../../../../protos/duels_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import DuelUtils from "../../../../utils/duel/duel/DuelUtils"

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
        const duel = await ctx.vars.duel.duel.get()
        return duel?.duelists.map(v => Number(v)) ?? 0
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<DuelAwayButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            ctx,
            id
        } = options

        const duel = await ctx.vars.duel.duel.require()
        await DuelUtils.end({
            duel,
            loser: id,
            ctx,
            isDelete: true,
            isKick: false
        })
    }
}

export default new DuelAwayButton()
