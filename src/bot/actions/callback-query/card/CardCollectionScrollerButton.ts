import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { InlineKeyboard } from "grammy"
import { type CardCollectionScrollerButtonData, CardCollectionScrollerButtonDataSchema } from "../../../../protos/card_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { ScrollerButtonEditMessageOptions } from "../../../../types/options"
import type { ScrollerButtonEditMessageResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import ScrollerButton from "../scroller/ScrollerButton"
import type UserCard from "../../../../db/entities/card/UserCard"
import UserCardService from "../../../../db/services/card/UserCardService"
import CardService from "../../../../db/services/card/CardService"
import CardUtils from "../../../../utils/card/CardUtils"
import ExchangeCardButton from "./ExchangeCardButton"
import { MIN_EXCHANGE_COUNT } from "../../../../consts/cards"
import ShopCardScrollerButton from "./ShopCardScrollerButton"
import ShopCardSellButton from "./ShopCardSellButton"

type T = UserCard

class CardCollectionScrollerButton extends ScrollerButton<T, CardCollectionScrollerButtonData> {
    override schema: GenMessage<CardCollectionScrollerButtonData> = CardCollectionScrollerButtonDataSchema
    override minimumRank: number = RankUtils.min
    override settingId: number = 160
    override name: string = 'ccscr'

    protected override _isNeedCache: boolean = true
    protected override _objectsPerPage: number = 1

    protected override async _getRawObjects(options: CallbackQueryActionOptions<CardCollectionScrollerButtonData>): Promise<T[]> {
        const {
            chatId,
            id
        } = options
        return await UserCardService.getAllByUser(chatId, id)
    }

    protected override async _getKeyboard(options: ScrollerButtonEditMessageOptions<T, CardCollectionScrollerButtonData>): Promise<InlineKeyboard> {
        const keyboard = new InlineKeyboard()
        const {
            slicedObjects: [card],
            ctx,
            id,
        } = options
        const bigId = BigInt(id)
        if (!card) return keyboard

        if (card.count >= MIN_EXCHANGE_COUNT) {
            keyboard
                .add(
                    ExchangeCardButton.button({
                        ctx,
                        data: {
                            id: bigId,
                            cardId: card.card
                        }
                    })
                )
                .row()
        }

        const cardId = card.card
        keyboard
            .add(
                ShopCardScrollerButton.button({
                    ctx,
                    key: 'card/button/buy',
                    data: {
                        cardId,
                        count: 1,
                        data: {
                            $typeName: 'ScrollerData',
                            id: bigId,
                            data: {
                                case: 'update',
                                value: false
                            }
                        }
                    }
                })
            )
            .add(
                ShopCardSellButton.button({
                    ctx,
                    data: {
                        id: bigId,
                        cardId
                    }
                })
            )

        return keyboard
    }

    protected override async _editMessage(options: ScrollerButtonEditMessageOptions<T, CardCollectionScrollerButtonData>): Promise<ScrollerButtonEditMessageResult> {
        const {
            slicedObjects: [userCard],
            ctx,
        } = options
        if (!userCard) {
            return {
                key: 'card/message/not-exist'
            }
        }

        const card = await CardService.get(userCard.card)
        if (!card) {
            return {
                key: 'card/message/not-exist'
            }
        }

        return CardUtils.showCollection({
            ctx,
            card,
            userCard
        })
    }
}

export default new CardCollectionScrollerButton()