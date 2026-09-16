import type { Conversation } from "@grammyjs/conversations"
import type { Context } from "grammy"
import type { BotContext } from "../../../../types/bot"
import ConversationAction from "../../base/ConversationAction"
import type InventoryItem from "../../../../db/entities/items/InventoryItem"
import Logger from "../../../../utils/logs/Logger"
import ItemUtils from "../../../../utils/items/ItemUtils"

class ItemGiftConversation extends ConversationAction<[InventoryItem]> {
    override name: string = 'item-gift'

    protected override async _execute(convo: Conversation<BotContext, Context>, ctx: Context, inventoryItem: InventoryItem): Promise<void> {
        const item = ItemUtils.get(inventoryItem.itemId)
        if (!item) return Logger.warn('ItemUseConversation._execute', 'no item', inventoryItem.itemId)

        
    }
}

export default new ItemGiftConversation()