import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type MarketDeleteButtonData, MarketDeleteButtonDataSchema } from "../../../../protos/market_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import MarketSlotService from "../../../../db/services/market/MarketSlotService"

class MarketDeleteButton extends CallbackQueryAction<MarketDeleteButtonData> {
    override schema: GenMessage<MarketDeleteButtonData> = MarketDeleteButtonDataSchema
    override defaultTextKey: string = 'button/delete'
    override minimumRank: number = RankUtils.min
    override settingId: number = 146
    override name: string = 'mdel'

    protected override async _getId(options: CallbackQueryActionOptions<MarketDeleteButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }

    protected override async _execute(options: CallbackQueryActionOptions<MarketDeleteButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
        } = options

        const {
            slotId
        } = data

        const isDeleted = await MarketSlotService.delete(slotId)

        return {
            key: 'market/message/delete-result',
            vars: {
                isDeleted
            }
        }
    }
}

export default new MarketDeleteButton()
