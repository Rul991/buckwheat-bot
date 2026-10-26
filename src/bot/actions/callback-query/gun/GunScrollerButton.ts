import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { InlineKeyboard } from "grammy"
import { type GunScrollerButtonData, GunScrollerButtonDataSchema } from "../../../../protos/gun_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { ScrollerButtonEditMessageOptions } from "../../../../types/options"
import type { ScrollerButtonEditMessageResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import ScrollerButton from "../scroller/ScrollerButton"
import InventoryItem from "../../../../db/entities/items/InventoryItem"
import InventoryItemService from "../../../../db/services/items/InventoryItemService"
import GunSetButton from "./GunSetButton"
import SelectedGunService from "../../../../db/services/gun/SelectedGunService"
import ItemUtils from "../../../../utils/items/ItemUtils"

type Object = number
type ScrollerData = GunScrollerButtonData

class GunScrollerButton extends ScrollerButton<Object, ScrollerData> {
    override schema: GenMessage<ScrollerData> = GunScrollerButtonDataSchema
    override minimumRank: number = RankUtils.min
    override settingId: number = 171
    override name: string = 'gunscr'

    protected override _isNeedCache: boolean = true
    protected override _objectsPerPage: number = 7

    protected override async _getRawObjects(options: CallbackQueryActionOptions<ScrollerData>): Promise<Object[]> {
        const {
            chatId, id
        } = options
        const inventory = await InventoryItemService.getInventory(chatId, id)
        const guns = InventoryItem.getGuns(inventory)

        return guns.map(v => v.id)
    }

    protected override async _getKeyboard(options: ScrollerButtonEditMessageOptions<Object, ScrollerData>): Promise<InlineKeyboard> {
        const keyboard = new InlineKeyboard()
        const {
            slicedObjects: guns,
            ctx,
            id,
        } = options
        const bigId = BigInt(id)

        for (const itemId of guns) {
            const item = ItemUtils.get(itemId)
            keyboard
                .add(GunSetButton.button({
                    ctx,
                    data: {
                        id: bigId,
                        itemId: itemId
                    },
                    vars: {
                        item: item?.getVars(ctx)
                    },
                    key: 'items/system/full-title'
                }))
        }

        return keyboard.toFlowed(1)
    }

    protected override async _editMessage(options: ScrollerButtonEditMessageOptions<Object, ScrollerData>): Promise<ScrollerButtonEditMessageResult> {
        const {
            objects: guns,
            chatId,
            id,
            ctx
        } = options

        const item = await SelectedGunService.getItem(chatId, id)

        return {
            key: 'gun/show',
            vars: {
                shouldChoose: guns.length > 0,
                item: item?.getVars(ctx)
            }
        }
    }
}

export default new GunScrollerButton()