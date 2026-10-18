import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { InlineKeyboard } from "grammy"
import type MarketSlot from "../../../../db/entities/market/MarketSlot"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { ScrollerButtonEditMessageOptions } from "../../../../types/options"
import type { ScrollerButtonEditMessageResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import ScrollerButton from "../scroller/ScrollerButton"
import { type MarketSlotScrollerButtonData, MarketSlotScrollerButtonDataSchema } from "../../../../protos/market_pb"
import MarketSlotService from "../../../../db/services/market/MarketSlotService"
import MarketShowButton from "./MarketShowButton"
import ItemUtils from "../../../../utils/items/ItemUtils"

class MarketSlotScrollerButton extends ScrollerButton<MarketSlot, MarketSlotScrollerButtonData> {
    override schema: GenMessage<MarketSlotScrollerButtonData> = MarketSlotScrollerButtonDataSchema
    override minimumRank: number = RankUtils.min
    override settingId: number = 142
    override name: string = 'mscr'

    protected override _isNeedCache: boolean = true
    protected override _objectsPerPage: number = 5

    protected override async _getRawObjects(options: CallbackQueryActionOptions<MarketSlotScrollerButtonData>): Promise<MarketSlot[]> {
        const {
            chatId
        } = options

        return await MarketSlotService.getAllByChatId(chatId)
    }

    protected override async _getKeyboard(options: ScrollerButtonEditMessageOptions<MarketSlot, MarketSlotScrollerButtonData>): Promise<InlineKeyboard> {
        const keyboard = new InlineKeyboard()
        const {
            slicedObjects: slots,
            ctx,
            id,
            page
        } = options
        const bigId = BigInt(id)

        for (const slot of slots) {
            const item = ItemUtils.get(slot.itemId)
            keyboard.add(
                MarketShowButton.button({
                    ctx,
                    data: {
                        id: bigId,
                        page,
                        count: 1,
                        slotId: slot.id
                    },
                    vars: {
                        slot,
                        item: {
                            ...item,
                            ...item?.getVars(ctx)
                        }
                    }
                })
            )
        }

        return keyboard.toFlowed(1)
    }

    protected override async _editMessage(options: ScrollerButtonEditMessageOptions<MarketSlot, MarketSlotScrollerButtonData>): Promise<ScrollerButtonEditMessageResult> {
        const {

        } = options

        return {
            key: 'market/message/start'
        }
    }
}

export default new MarketSlotScrollerButton()