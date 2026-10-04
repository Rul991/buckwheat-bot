import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { InventoryGiftButtonDataSchema, type InventoryGiftButtonData } from "../../../../protos/inventory_pb"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import ItemGiftConversation from "../../conversations/item/ItemGiftConversation"
import ItemUtils from "../../../../utils/items/ItemUtils"
import InventoryItemService from "../../../../db/services/items/InventoryItemService"

class InventoryGiftButton extends CallbackQueryAction<InventoryGiftButtonData> {
    override defaultTextKey: string = 'inventory/button/gift'
    override schema: GenMessage<InventoryGiftButtonData> = InventoryGiftButtonDataSchema
    override minimumRank: number = RankUtils.min
    override settingId: number = 101
    override name: string = 'invgft'

    protected override async _getId(options: CallbackQueryActionOptions<InventoryGiftButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<InventoryGiftButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            ctx,
            data,
            chatId,
            id
        } = options

        const {
            itemId
        } = data
        const item = ItemUtils.get(itemId)
        if(!item) return {
            key: 'item/not-exist',
            vars: {
                totally: true
            }
        }

        const inventoryItem = await InventoryItemService.get({
            chatId,
            id,
            item
        })
        if(!inventoryItem) {
            return {
                key: 'item/not-exist'
            }
        }

        await ItemGiftConversation.enter(
            ctx,
            inventoryItem
        )
    }
}

export default new InventoryGiftButton()