import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { InlineKeyboard } from "grammy"
import { type ShopCardListScrollerButtonData, ShopCardListScrollerButtonDataSchema } from "../../../../protos/card_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { ScrollerButtonEditMessageOptions } from "../../../../types/options"
import type { ScrollerButtonEditMessageResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import ScrollerButton from "../scroller/ScrollerButton"
import ShopCardService from "../../../../db/services/card/ShopCardService"
import CardService from "../../../../db/services/card/CardService"
import ShopCardScrollerButton from "./ShopCardScrollerButton"

type Object = number
type ScrollerData = ShopCardListScrollerButtonData

class ShopCardListScrollerButton extends ScrollerButton<Object, ScrollerData> {
    override schema: GenMessage<ScrollerData> = ShopCardListScrollerButtonDataSchema
    override minimumRank: number = RankUtils.min
    override settingId: number = 169
    override name: string = 'shcards'

    protected override _isNeedCache: boolean = true
    protected override _objectsPerPage: number = 7
    
    protected override async _getRawObjects(options: CallbackQueryActionOptions<ScrollerData>): Promise<Object[]> {
        const {
            chatId
        } = options
        
        const ids = await ShopCardService.getUniqueCardIds(chatId)
        const cards = await CardService.getByIds(ids)
        const cardsArray = cards.values().toArray().sort(
            (a, b) => a.rarity - b.rarity
        )
        return cardsArray.map(v => v.id)
    }

    protected override async _getKeyboard(options: ScrollerButtonEditMessageOptions<Object, ScrollerData>): Promise<InlineKeyboard> {
        const keyboard = new InlineKeyboard()
        const {
            slicedObjects: cardIds,
            ctx,
            id,
        } = options
        const bigId = BigInt(id)

        const cards = await CardService.getByIds(cardIds)
        for (const cardId of cardIds) {
            keyboard.add(
                ShopCardScrollerButton.button({
                    ctx,
                    data: {
                        cardId,
                        count: 1,
                        data: {
                            id: bigId,
                            data: {
                                case: 'update',
                                value: false,
                            },
                            $typeName: 'ScrollerData',
                        }
                    },
                    key: 'card/button/card',
                    vars: {
                        card: cards.get(cardId)
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
            key: 'card/message/shop'
        }
    }
}

export default new ShopCardListScrollerButton()