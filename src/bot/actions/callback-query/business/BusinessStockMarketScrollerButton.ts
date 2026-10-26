import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { InlineKeyboard } from "grammy"
import { type BusinessStockMarketScrollerButtonData, BusinessStockMarketScrollerButtonDataSchema } from "../../../../protos/business_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { ScrollerButtonEditMessageOptions } from "../../../../types/options"
import type { ScrollerButtonEditMessageResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import ScrollerButton from "../scroller/ScrollerButton"
import BusinessStockMarketSlot from "../../../../db/entities/business/BusinessStockMarketSlot"
import BusinessStockMarketSlotService from "../../../../db/services/business/BusinessStockMarketSlotService"
import BusinessStockShowButton from "./BusinessStockShowButton"
import type Business from "../../../../db/entities/business/Business"
import BusinessService from "../../../../db/services/business/BusinessService"
import { MAX_BUSINESS_STAKES } from "../../../../consts/number"

type Object = {
    slot: BusinessStockMarketSlot
    business: Business
}
type ScrollerData = BusinessStockMarketScrollerButtonData

class BusinessStockMarketScrollerButton extends ScrollerButton<Object, ScrollerData> {
    override schema: GenMessage<ScrollerData> = BusinessStockMarketScrollerButtonDataSchema
    override minimumRank: number = RankUtils.min
    override settingId: number = 176
    override name: string = 'bsmscr'

    protected override _isNeedCache: boolean = true
    protected override _objectsPerPage: number = 6

    protected override async _getRawObjects(options: CallbackQueryActionOptions<ScrollerData>): Promise<Object[]> {
        const {
            chatId
        } = options
        const slots = await BusinessStockMarketSlotService.getAllByChatId(chatId)
        const businesses = await BusinessService.getAllByIds(
            slots.map(v => v.businessId)
        )

        return slots.map(v => {
            return {
                slot: v,
                business: businesses.get(v.businessId)!
            }
        })
    }

    protected override async _getKeyboard(options: ScrollerButtonEditMessageOptions<Object, ScrollerData>): Promise<InlineKeyboard> {
        const keyboard = new InlineKeyboard()
        const {
            slicedObjects: slots,
            ctx,
            id,
            page
        } = options
        const bigId = BigInt(id)

        for (const { slot, business } of slots) {
            keyboard.add(
                BusinessStockShowButton.button({
                    ctx,
                    data: {
                        id: bigId,
                        businessId: business.id,
                        count: 1,
                        page,
                        sellerId: BigInt(slot.seller)
                    },
                    vars: {
                        business,
                        slot: {
                            ...slot,
                            max: MAX_BUSINESS_STAKES
                        }
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
            key: 'business/message/market/list'
        }
    }
}

export default new BusinessStockMarketScrollerButton()