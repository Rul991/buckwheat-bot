import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { InlineKeyboard } from "grammy"
import { type BusinessScrollerButtonData, BusinessScrollerButtonDataSchema } from "../../../../protos/business_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { ScrollerButtonEditMessageOptions } from "../../../../types/options"
import type { ScrollerButtonEditMessageResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import ScrollerButton from "../scroller/ScrollerButton"
import type BusinessStock from "../../../../db/entities/business/BusinessStock"
import BusinessStockService from "../../../../db/services/business/BusinessStockService"
import type Business from "../../../../db/entities/business/Business"
import BusinessService from "../../../../db/services/business/BusinessService"
import BusinessShowButton from "./BusinessShowButton"
import { MAX_BUSINESS_STAKES } from "../../../../consts/number"

type Object = {
    stock: BusinessStock
    business: Business
}
type ScrollerData = BusinessScrollerButtonData

class BusinessScrollerButton extends ScrollerButton<Object, ScrollerData> {
    override schema: GenMessage<ScrollerData> = BusinessScrollerButtonDataSchema
    override minimumRank: number = RankUtils.min
    override settingId: number = 173
    override name: string = 'bscr'

    protected override _isNeedCache: boolean = true
    protected override _objectsPerPage: number = 7

    protected override async _getRawObjects(options: CallbackQueryActionOptions<ScrollerData>): Promise<Object[]> {
        const {
            chatId,
            id,
        } = options
        const stocks = await BusinessStockService.getAllByUser(chatId, id)
        const businesses = await BusinessService.getAllByIds(
            stocks.map(v => v.businessId)
        )

        return stocks.map(v => {
            return {
                stock: v,
                business: businesses.get(v.businessId)!
            }
        })
    }

    protected override async _getKeyboard(options: ScrollerButtonEditMessageOptions<Object, ScrollerData>): Promise<InlineKeyboard> {
        const keyboard = new InlineKeyboard()
        const {
            slicedObjects: stocks,
            ctx,
            id,
            page
        } = options
        const bigId = BigInt(id)

        for (const { stock, business } of stocks) {
            keyboard.add(
                BusinessShowButton.button({
                    ctx,
                    data: {
                        id: bigId,
                        page,
                        businessId: business.id
                    },
                    vars: {
                        stock: {
                            ...stock,
                            max: MAX_BUSINESS_STAKES
                        },
                        business
                    }
                })
            )
        }

        return keyboard.toFlowed(1)
    }

    protected override async _editMessage(options: ScrollerButtonEditMessageOptions<Object, ScrollerData>): Promise<ScrollerButtonEditMessageResult> {
        const {

        } = options

        return {
            key: 'business/message/stock/stocks'
        }
    }
}

export default new BusinessScrollerButton()