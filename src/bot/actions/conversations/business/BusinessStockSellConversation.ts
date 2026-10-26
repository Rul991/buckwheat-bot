import { Conversation } from "@grammyjs/conversations"
import type { Context } from "grammy"
import type BusinessStock from "../../../../db/entities/business/BusinessStock"
import type { BotContext } from "../../../../types/bot"
import ConversationAction from "../../base/ConversationAction"
import ConversationUtils from "../../../../utils/conversation/ConversationUtils"
import { MAX_BUSINESS_STOCK_PRICE, MIN_BUSINESS_STOCK_PRICE } from "../../../../consts/number"
import BusinessStockMarketSlotService from "../../../../db/services/business/BusinessStockMarketSlotService"
import BusinessStockMarketSlot from "../../../../db/entities/business/BusinessStockMarketSlot"
import BusinessService from "../../../../db/services/business/BusinessService"

type T = [BusinessStock]

class BusinessStockSellConversation extends ConversationAction<T> {
    override name: string = 'business-stock-sell'

    protected override async _execute(conversation: Conversation<BotContext, Context>, ctx: Context, ...[stock]: T): Promise<void> {
        const needId = ctx.from!.id

        const count = await ConversationUtils.getNumber({
            conversation,
            needId,
            min: 1,
            max: stock.count,
            lazyKeys: ['user'],
            key: 'business/conversation/sell/enter/count'
        })

        const price = await ConversationUtils.getNumber({
            conversation,
            needId,
            min: MIN_BUSINESS_STOCK_PRICE,
            max: MAX_BUSINESS_STOCK_PRICE,
            lazyKeys: ['user'],
            key: 'business/conversation/sell/enter/price'
        })

        const [slot, business] = await conversation.external(
            async _ => {
                const {
                    chatId,
                    id,
                    businessId,
                } = stock

                return await Promise.all([
                    BusinessStockMarketSlotService.create(
                        new BusinessStockMarketSlot({
                            chatId,
                            seller: id,
                            businessId,
                            count,
                            price
                        })
                    ),
                    BusinessService.get(stock.businessId)
                ])
            }
        )

        await ConversationUtils.replyInConversation(
            conversation,
            'business/conversation/sell/done',
            {
                vars: {
                    business,
                    slot,
                    isNew: 'new' in slot
                },
                lazyKeys: ['user']
            }
        )
    }
}

export default new BusinessStockSellConversation()