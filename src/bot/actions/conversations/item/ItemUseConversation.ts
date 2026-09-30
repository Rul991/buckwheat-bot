import type { Conversation } from "@grammyjs/conversations"
import type { Context } from "grammy"
import type { BotContext } from "../../../../types/bot"
import ConversationAction from "../../base/ConversationAction"
import ConversationUtils from "../../../../utils/conversation/ConversationUtils"
import type InventoryItem from "../../../../db/entities/items/InventoryItem"
import MathUtils from "../../../../utils/math/MathUtils"
import InventoryItemService from "../../../../db/services/items/InventoryItemService"
import Logger from "../../../../utils/logs/Logger"
import ItemUtils from "../../../../utils/items/ItemUtils"
import StringUtils from "../../../../utils/string/StringUtils"

class ItemUseConversation extends ConversationAction<[InventoryItem]> {
    override name: string = 'item-use'

    protected override async _execute(convo: Conversation<BotContext, Context>, ctx: Context, inventoryItem: InventoryItem): Promise<void> {
        const item = ItemUtils.get(inventoryItem.itemId)
        if (!item) return Logger.warn('ItemUseConversation._execute', 'no item', inventoryItem.itemId)

        Logger.debug(
            'ItemUseConversation._execute',
            {
                item,
                inventoryItem
            }
        )

        const needId = ctx.from!.id
        const min = 1
        const max = inventoryItem.count

        if (min > max) {
            await ConversationUtils.replyInConversation(
                convo,
                'items/convo/not-enough-count',
                ctx => ({
                    vars: {
                        item: {
                            title: item.getTitle(ctx)
                        }
                    },
                    lazyKeys: ['user']
                })
            )
            return
        }

        await ConversationUtils.replyInConversation(
            convo,
            'items/convo/count',
            ctx => ({
                vars: {
                    min,
                    max,
                    item: {
                        emoji: item.getEmoji(ctx)
                    }
                },
                lazyKeys: ['user']
            })
        )
        const rawCountCtx = await convo.waitFor('msg:text')
            .andFrom(needId)
        const rawCount = rawCountCtx.msg.text

        const count = MathUtils.clamp(
            Math.floor(
                StringUtils.getNumberFromString(
                    rawCount,
                    min
                )
            ),
            min,
            max
        )
        
        await convo.external(
            async ctx => {
                const id = ctx.vars.id!
                const chatId = ctx.vars.chatId!

                return await InventoryItemService.use({
                    chatId,
                    id,
                    item,
                    count,
                    ctx
                })
            }
        )
    }
}

export default new ItemUseConversation()