import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type MarketSellButtonData, MarketSellButtonDataSchema } from "../../../../protos/market_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import ItemUtils from "../../../../utils/items/ItemUtils"
import MarketSellConversation from "../../conversations/market/MarketSellConversation"
import InventoryItemService from "../../../../db/services/items/InventoryItemService"

class MarketSellButton extends CallbackQueryAction<MarketSellButtonData> {
    override schema: GenMessage<MarketSellButtonData> = MarketSellButtonDataSchema
    override defaultTextKey: string = 'market/button/sell'
    override minimumRank: number = RankUtils.min
    override settingId: number = 144
    override name: string = 'msl'

    protected override async _getId(options: CallbackQueryActionOptions<MarketSellButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }

    protected override async _execute(options: CallbackQueryActionOptions<MarketSellButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            ctx,
            chatId,
            id
        } = options

        const {
            itemId,
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

        await MarketSellConversation.enter(
            ctx,
            {
                inventoryItem
            }
        )
    }
}

export default new MarketSellButton()