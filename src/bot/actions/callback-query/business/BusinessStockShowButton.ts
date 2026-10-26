import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type BusinessStockShowButtonData, BusinessStockShowButtonDataSchema } from "../../../../protos/business_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import BusinessService from "../../../../db/services/business/BusinessService"
import BusinessStockMarketSlotService from "../../../../db/services/business/BusinessStockMarketSlotService"
import BusinessUtils from "../../../../utils/business/BusinessUtils"
import MessageUtils from "../../../../utils/bot/MessageUtils"

class BusinessStockShowButton extends CallbackQueryAction<BusinessStockShowButtonData> {
    override schema: GenMessage<BusinessStockShowButtonData> = BusinessStockShowButtonDataSchema
    override defaultTextKey: string = 'business/button/market/show'
    override minimumRank: number = RankUtils.min
    override settingId: number = 178
    override name: string = 'bsmsh'
    
    protected override async _getId(options: CallbackQueryActionOptions<BusinessStockShowButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<BusinessStockShowButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            chatId,
            ctx
        } = options

        const {
            businessId,
            page,
            sellerId: rawSellerId,
            count
        } = data
        const sellerId = Number(rawSellerId)

        const business = await BusinessService.get(businessId)
        if(!business) {
            return {
                key: 'business/message/not-exist'
            }
        }

        const slot = await BusinessStockMarketSlotService.get({
            chatId,
            seller: sellerId,
            businessId
        })
        if(!slot) {
            return {
                key: 'business/message/market/not-exist'
            }
        }

        const {
            key,
            options: messageOptions
        } = await BusinessUtils.showMarket({
            ctx,
            business,
            slot,
            page,
            count
        })

        await MessageUtils.editText(
            ctx,
            key,
            messageOptions
        )
    }
}

export default new BusinessStockShowButton()
