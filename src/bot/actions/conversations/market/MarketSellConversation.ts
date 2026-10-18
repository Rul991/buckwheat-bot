import { Conversation } from "@grammyjs/conversations"
import type { Context } from "grammy"
import type { BotContext } from "../../../../types/bot"
import ConversationAction from "../../base/ConversationAction"
import type InventoryItem from "../../../../db/entities/items/InventoryItem"
import ItemUtils from "../../../../utils/items/ItemUtils"
import ConversationUtils from "../../../../utils/conversation/ConversationUtils"
import StringUtils from "../../../../utils/string/StringUtils"
import MathUtils from "../../../../utils/math/MathUtils"
import MarketSlotService from "../../../../db/services/market/MarketSlotService"
import MarketSlot from "../../../../db/entities/market/MarketSlot"

type T = [{
    inventoryItem: InventoryItem
}]

class MarketSellConversation extends ConversationAction<T> {
    override name: string = 'market-sell'
    private readonly _abortNumber = -1
    private readonly _minCount = 1
    private readonly _minPrice = 0
    private readonly _maxPrice = 26_02_2025

    private async _abort(conversation: Conversation<BotContext, Context>) {
        await ConversationUtils.replyInConversation(
            conversation,
            'market/conversation/abort',
            {
                lazyKeys: ['user']
            }
        )
        return await conversation.halt()
    }

    private async _getCount(conversation: Conversation<BotContext, Context>, maxCount: number, needId: number) {
        await ConversationUtils.replyInConversation(
            conversation,
            'market/conversation/enter-count',
            {
                lazyKeys: ['user'],
                vars: {
                    min: this._minCount,
                    max: maxCount
                }
            }
        )

        const countCtx = await conversation.waitFor('msg:text')
            .andFrom(needId)
        const rawCount = StringUtils.getNumberFromString(
            countCtx.msg.text,
            this._abortNumber
        )
        if (rawCount == this._abortNumber) {
            return await this._abort(conversation)
        }
        return MathUtils.clamp(
            rawCount,
            this._minCount,
            maxCount
        )
    }

    private async _getPrice(conversation: Conversation<BotContext, Context>, needId: number) {
        await ConversationUtils.replyInConversation(
            conversation,
            'market/conversation/enter-price',
            {
                lazyKeys: ['user'],
                vars: {
                    min: this._minPrice,
                    max: this._maxPrice
                }
            }
        )

        const ctx = await conversation.waitFor('msg:text')
            .andFrom(needId)
        const rawPrice = StringUtils.getNumberFromString(
            ctx.msg.text,
            this._abortNumber
        )
        if (rawPrice == this._abortNumber) {
            return await this._abort(conversation)
        }
        return MathUtils.clamp(
            rawPrice,
            this._minPrice,
            this._maxPrice
        )
    }

    protected override async _execute(conversation: Conversation<BotContext, Context>, ctx: Context, ...[values]: T): Promise<void> {
        const needId = ctx.from!.id
        const {
            inventoryItem
        } = values
        const item = ItemUtils.get(inventoryItem.itemId)!
        const maxCount = inventoryItem.count

        const count = await this._getCount(
            conversation,
            maxCount,
            needId
        )
        const price = await this._getPrice(
            conversation,
            needId
        )

        await conversation.external(
            async ctx => {
                const chatId = ctx.vars.chatId!
                await MarketSlotService.create(
                    new MarketSlot({
                        chatId,
                        count,
                        price,
                        item,
                        seller: needId
                    })
                )
            }
        )
        await ConversationUtils.replyInConversation(
            conversation,
            'market/conversation/done',
            ctx => ({
                lazyKeys: ['user'],
                vars: {
                    item: item.getVars(ctx),
                    count,
                    price
                }
            })
        )
    }
}

export default new MarketSellConversation()