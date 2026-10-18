import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type MarketShowButtonData, MarketShowButtonDataSchema } from "../../../../protos/market_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import MarketSlotUtils from "../../../../utils/market/MartketSlotUtils"
import MarketSlotService from "../../../../db/services/market/MarketSlotService"
import MessageUtils from "../../../../utils/bot/MessageUtils"

class MarketShowButton extends CallbackQueryAction<MarketShowButtonData> {
    override schema: GenMessage<MarketShowButtonData> = MarketShowButtonDataSchema
    override defaultTextKey: string = 'market/button/show'
    override minimumRank: number = RankUtils.min
    override settingId: number = 143
    override name: string = 'msh'

    protected override async _getId(options: CallbackQueryActionOptions<MarketShowButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<MarketShowButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            ctx,
        } = options

        const {
            count,
            page,
            slotId
        } = data

        const slot = await MarketSlotService.get(slotId)
        if(!slot) {
            return {
                key: 'market/reason/slot-not-exist'
            }
        }

        const {
            key,
            options: messageOptions
        } = await MarketSlotUtils.show({
            count,
            ctx,
            page,
            slot
        })

        await MessageUtils.editText(
            ctx,
            key,
            messageOptions
        )
    }
}

export default new MarketShowButton()