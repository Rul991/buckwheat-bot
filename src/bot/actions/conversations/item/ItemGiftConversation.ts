import { Conversation } from "@grammyjs/conversations"
import type { Context } from "grammy"
import type { BotContext } from "../../../../types/bot"
import ConversationAction from "../../base/ConversationAction"
import InventoryItem from "../../../../db/entities/items/InventoryItem"
import Logger from "../../../../utils/logs/Logger"
import ItemUtils from "../../../../utils/items/ItemUtils"
import ConversationUtils from "../../../../utils/conversation/ConversationUtils"
import StringUtils from "../../../../utils/string/StringUtils"
import MathUtils from "../../../../utils/math/MathUtils"
import InventoryItemService from "../../../../db/services/items/InventoryItemService"
import UserService from "../../../../db/services/user/UserService"

class ItemGiftConversation extends ConversationAction<[InventoryItem]> {
    override name: string = 'item-gift'

    protected override async _execute(convo: Conversation<BotContext, Context>, _ctx: Context, inventoryItem: InventoryItem): Promise<void> {
        const item = ItemUtils.get(inventoryItem.itemId)
        if (!item) return Logger.warn('ItemUseConversation._execute', 'no item', inventoryItem.itemId)

        const id = inventoryItem.id
        const chatId = inventoryItem.chatId

        const minCount = 1
        const maxCount = inventoryItem.count

        await ConversationUtils.replyInConversation(
            convo,
            'inventory/gift/enter',
            ctx => {
                return {
                    lazyKeys: ['user'],
                    vars: {
                        minCount,
                        maxCount,
                        item: item.getVars(ctx)
                    }
                }
            }
        )

        const replyCtx = await convo.waitFor('msg:text')
            .andFrom(id)
        const replyId = replyCtx.msg.reply_to_message?.from?.id

        if (!replyId) {
            await ConversationUtils.replyInConversation(
                convo,
                'inventory/gift/stop',
                {
                    lazyKeys: ['user']
                }
            )
            return
        }

        const rawCount = StringUtils.getNumberFromString(replyCtx.msg.text)
        const count = MathUtils.clamp(rawCount, minCount, maxCount)
        const reply = await convo.external(
            async _ => {
                return await UserService.get(chatId, replyId)
            }
        )

        const { ok, reason } = await InventoryItemService.gift({
            chatId,
            owner: id,
            target: replyId,
            item,
            count
        })

        if (!ok) {
            await ConversationUtils.replyInConversation(
                convo,
                'inventory/gift/not-gift',
                ctx => {
                    return {
                        lazyKeys: ['user'],
                        vars: {
                            reply,
                            item: item.getVars(ctx),
                            count,
                            reason: ctx.t(`inventory/gift/reason/${reason}`)
                        }
                    }
                }
            )
            return
        }

        await ConversationUtils.replyInConversation(
            convo,
            'inventory/gift/gift',
            ctx => {
                return {
                    lazyKeys: ['user'],
                    vars: {
                        reply,
                        item: item.getVars(ctx),
                        count
                    }
                }
            }
        )
        return
    }
}

export default new ItemGiftConversation()