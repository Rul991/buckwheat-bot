import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import type InventoryItem from "../../../../db/entities/items/InventoryItem"
import { InventoryScrollerButtonDataSchema, type InventoryScrollerButtonData } from "../../../../protos/inventory_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { ScrollerButtonEditMessageOptions } from "../../../../types/options"
import type { ScrollerButtonEditMessageResult } from "../../../../types/results"
import ScrollerButton from "../scroller/ScrollerButton"
import RankUtils from "../../../../utils/db/RankUtils"
import InventoryItemService from "../../../../db/services/items/InventoryItemService"
import { InlineKeyboard } from "grammy"
import InventoryShowButton from "./InventoryShowButton"
import ItemUtils from "../../../../utils/items/ItemUtils"

class InventoryScrollerButton extends ScrollerButton<InventoryItem, InventoryScrollerButtonData> {
    override schema: GenMessage<InventoryScrollerButtonData> = InventoryScrollerButtonDataSchema
    override minimumRank: number = RankUtils.min
    override settingId: number = 69
    override name: string = 'invscr'

    protected override async _getKeyboard(options: ScrollerButtonEditMessageOptions<InventoryItem, InventoryScrollerButtonData>): Promise<InlineKeyboard> {
        const {
            slicedObjects,
            page,
            ctx,
            id: userId
        } = options

        const keyboard = new InlineKeyboard()
        const bigId = BigInt(userId)

        for (const inventoryItem of slicedObjects) {
            const item = ItemUtils.get(inventoryItem.itemId)
            if(!item) continue

            keyboard
                .add(InventoryShowButton.button({
                    ctx,
                    data: {
                        id: bigId,
                        itemId: item.id,
                        page
                    },
                    vars: {
                        item: item.getVars(ctx),
                        count: inventoryItem.count
                    },
                    key: 'items/system/full-title'
                }))
                .row()
        }

        return keyboard
    }

    protected override async _getRawObjects(options: CallbackQueryActionOptions<InventoryScrollerButtonData>): Promise<InventoryItem[]> {
        const {
            chatId,
            id
        } = options

        return await InventoryItemService.getInventory(chatId, id)
    }

    protected override async _editMessage(options: ScrollerButtonEditMessageOptions<InventoryItem, InventoryScrollerButtonData>): Promise<ScrollerButtonEditMessageResult> {
        const { } = options
        return {
            key: 'inventory/start'
        }
    }
}

export default new InventoryScrollerButton()