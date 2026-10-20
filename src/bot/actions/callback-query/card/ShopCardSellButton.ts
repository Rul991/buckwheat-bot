import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type ShopCardSellButtonData, ShopCardSellButtonDataSchema } from "../../../../protos/card_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import UserCardService from "../../../../db/services/card/UserCardService"
import CardService from "../../../../db/services/card/CardService"
import SellCardConversation from "../../conversations/card/SellCardConversation"

class ShopCardSellButton extends CallbackQueryAction<ShopCardSellButtonData> {
    override schema: GenMessage<ShopCardSellButtonData> = ShopCardSellButtonDataSchema
    override defaultTextKey: string = 'card/button/sell'
    override minimumRank: number = RankUtils.min
    override settingId: number = 168
    override name: string = 'shcardsell'
    
    protected override async _getId(options: CallbackQueryActionOptions<ShopCardSellButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<ShopCardSellButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            chatId,
            id,
            ctx
        } = options

        const {
            cardId
        } = data

        const card = await CardService.get(cardId)
        if(!card) {
            return {
                key: 'card/message/not-exist'
            }
        }

        const userCard = await UserCardService.get({
            chatId,
            id,
            card: cardId
        })
        if(!userCard || userCard.count <= 0) {
            return {
                key: 'card/message/reason/low-count'
            }
        }

        await SellCardConversation.enter(
            ctx,
            {
                userCard,
                card
            }
        )
    }
}

export default new ShopCardSellButton()
