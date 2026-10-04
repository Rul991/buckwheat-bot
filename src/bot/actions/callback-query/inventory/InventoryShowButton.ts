import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { InventoryShowButtonDataSchema, type InventoryShowButtonData } from "../../../../protos/inventory_pb"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import InventoryItemService from "../../../../db/services/items/InventoryItemService"
import ItemUtils from "../../../../utils/items/ItemUtils"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import { showItemKeyboard } from "../../../keyboards/inventory"

class InventoryShowButton extends CallbackQueryAction<InventoryShowButtonData> {
    override defaultTextKey: string = 'button/show'
    override schema: GenMessage<InventoryShowButtonData> = InventoryShowButtonDataSchema
    override minimumRank: number = RankUtils.min
    override settingId: number = 70
    override name: string = 'invshw'

    protected override async _getId(options: CallbackQueryActionOptions<InventoryShowButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<InventoryShowButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            chatId,
            id,
            data,
            ctx
        } = options

        const {
            itemId,
            page
        } = data

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

        const percents = ItemUtils.getDropPercents(item)

        await MessageUtils.editText(
            ctx,
            'inventory/show',
            {
                vars: {
                    itemVars: item.getVars(ctx),
                    item,
                    inventoryItem,
                    percents,
                    ammo: item.gun?.ammo.getTitle(ctx)
                },
                keyboard: await showItemKeyboard(
                    ctx,
                    {
                        id,
                        page,
                        item,
                        count: inventoryItem.count
                    }
                )
            }
        )
    }
}

export default new InventoryShowButton()