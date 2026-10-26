import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type BusinessStockBuyButtonData, BusinessStockBuyButtonDataSchema } from "../../../../protos/business_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import BusinessStockMarketSlotService from "../../../../db/services/business/BusinessStockMarketSlotService"
import BusinessUtils from "../../../../utils/business/BusinessUtils"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import BusinessService from "../../../../db/services/business/BusinessService"

class BusinessStockBuyButton extends CallbackQueryAction<BusinessStockBuyButtonData> {
    override schema: GenMessage<BusinessStockBuyButtonData> = BusinessStockBuyButtonDataSchema
    override defaultTextKey: string = 'business/button/market/buy'
    override minimumRank: number = RankUtils.min
    override settingId: number = 179
    override name: string = 'bsmbuy'

    protected override async _getId(options: CallbackQueryActionOptions<BusinessStockBuyButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }

    protected override async _execute(options: CallbackQueryActionOptions<BusinessStockBuyButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            chatId,
            id,
            ctx,
        } = options

        const {
            businessId,
            sellerId,
            count,
            page
        } = data

        const buyResult = await BusinessStockMarketSlotService.buy({
            businessId,
            buyer: id,
            chatId,
            count,
            seller: Number(sellerId)
        })

        if (!buyResult.ok) {
            return {
                key: `business/message/reason/${buyResult.reason}`
            }
        }

        const {
            slot,
            count: availableCount
        } = buyResult
        const business = await BusinessService.get(businessId)
        
        if (slot && business) {
            const {
                key,
                options: messageOptions
            } = await BusinessUtils.showMarket({
                ctx,
                business,
                slot,
                count,
                page
            })

            await MessageUtils.editText(
                ctx,
                key,
                messageOptions
            )
        }
        else {
            await MessageUtils.deleteMessages(ctx)
        }

        return {
            key: 'business/message/reason/done',
            vars: {
                count: availableCount,
                business
            }
        }
    }
}

export default new BusinessStockBuyButton()
