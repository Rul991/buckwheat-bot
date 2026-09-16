import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { BaseScrollerDataSchema, type BaseScrollerData } from "../../../../protos/scroller_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { ScrollerButtonEditMessageOptions } from "../../../../types/options"
import type { ScrollerButtonEditMessageResult } from "../../../../types/results"
import type Item from "../../../../utils/items/Item"
import ScrollerButton from "../scroller/ScrollerButton"
import RankUtils from "../../../../utils/db/RankUtils"
import { shopItems } from "../../../../resources/items/shop"
import { InlineKeyboard } from "grammy"
import ShopShowButton from "./ShopShowButton"

class ShopScrollerButton extends ScrollerButton<Item> {
    override schema: GenMessage<BaseScrollerData> = BaseScrollerDataSchema
    override minimumRank: number = RankUtils.min
    override settingId: number = 86
    override name: string = 'shopscr'
    protected override _isNeedCache: boolean = false
    protected override _objectsPerPage: number = 5
    
    protected override async _getRawObjects(_options: CallbackQueryActionOptions<BaseScrollerData>): Promise<Item<any>[]> {
        return shopItems
    }

    protected override async _getKeyboard(options: ScrollerButtonEditMessageOptions<Item<any>, BaseScrollerData>): Promise<InlineKeyboard> {
        const keyboard = new InlineKeyboard()
        const {
            slicedObjects: items,
            ctx,
            id,
            page
        } = options
        const bigId = BigInt(id)

        keyboard.add(
            ...items.map(
                (item, i) => {
                    return ShopShowButton.button({
                        ctx,
                        vars: {
                            item: item.getVars(ctx)
                        },
                        data: {
                            id: bigId,
                            page,
                            index: this._getStartIndex(page) + i,
                            count: 1
                        }
                    })
                }
            )
        )

        return keyboard.toFlowed(1)
    }

    protected override async _editMessage(options: ScrollerButtonEditMessageOptions<Item<any>, BaseScrollerData>): Promise<ScrollerButtonEditMessageResult> {
        const {

        } = options

        return {
            key: 'shop/list'
        }
    }
}

export default new ShopScrollerButton()