import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type BusinessStockSellButtonData, BusinessStockSellButtonDataSchema } from "../../../../protos/business_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import BusinessStockService from "../../../../db/services/business/BusinessStockService"
import BusinessStockSellConversation from "../../conversations/business/BusinessStockSellConversation"

class BusinessStockSellButton extends CallbackQueryAction<BusinessStockSellButtonData> {
    override schema: GenMessage<BusinessStockSellButtonData> = BusinessStockSellButtonDataSchema
    override defaultTextKey: string = 'business/button/market/sell'
    override minimumRank: number = RankUtils.min
    override settingId: number = 177
    override name: string = 'bsmsell'
    
    protected override async _getId(options: CallbackQueryActionOptions<BusinessStockSellButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<BusinessStockSellButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            chatId,
            id,
            ctx,
        } = options

        const {
            businessId
        } = data

        const stock = await BusinessStockService.get({
            chatId,
            id,
            businessId
        })
        if(!stock) {
            return {
                key: 'business/message/stock/not-exist'
            }
        }

        await BusinessStockSellConversation.enter(
            ctx,
            stock
        )
    }
}

export default new BusinessStockSellButton()
