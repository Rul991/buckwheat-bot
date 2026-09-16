import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { InventoryUseButtonDataSchema, type InventoryUseButtonData } from "../../../../protos/inventory_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import RankUtils from "../../../../utils/db/RankUtils"
import ItemUtils from "../../../../utils/items/ItemUtils"
import InventoryItemService from "../../../../db/services/items/InventoryItemService"
import ItemUseConversation from "../../conversations/item/ItemUseConversation"

class InventoryUseButton extends CallbackQueryAction<InventoryUseButtonData> {
    override schema: GenMessage<InventoryUseButtonData> = InventoryUseButtonDataSchema
    override defaultTextKey: string = 'items/button/use'
    override minimumRank: number = RankUtils.min
    override settingId: number = 75
    override name: string = 'invuse'

    protected override async _getId(options: CallbackQueryActionOptions<InventoryUseButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<InventoryUseButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            chatId,
            id,
            data: {
                itemId
            },
            ctx
        } = options

        const item = ItemUtils.get(itemId)
        if(!item) {
            return {
                key: 'inventory/not-exist',
                vars: {
                    totally: true
                }
            }
        }

        const inventoryItem = await InventoryItemService.get({
            chatId,
            id,
            item
        })
        if(!inventoryItem) {
            return {
                key: 'inventory/not-exist'
            }
        }

        await ItemUseConversation.enter(ctx, inventoryItem)
    }
}

export default new InventoryUseButton()