import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { InlineKeyboard } from "grammy"
import { type ShopCardScrollerButtonData, ShopCardScrollerButtonDataSchema } from "../../../../protos/card_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { ScrollerButtonEditMessageOptions } from "../../../../types/options"
import type { ScrollerButtonEditMessageResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import ScrollerButton from "../scroller/ScrollerButton"
import type ShopCard from "../../../../db/entities/card/ShopCard"
import ShopCardService from "../../../../db/services/card/ShopCardService"
import KeyboardCreator from "../../../../utils/keyboard/KeyboardCreator"
import CardService from "../../../../db/services/card/CardService"
import CardCollectionScrollerButton from "./CardCollectionScrollerButton"
import CardUtils from "../../../../utils/card/CardUtils"
import ShopCardBuyButton from "./ShopCardBuyButton"

type Object = ShopCard
type ScrollerData = ShopCardScrollerButtonData

class ShopCardScrollerButton extends ScrollerButton<Object, ScrollerData> {
    override schema: GenMessage<ScrollerData> = ShopCardScrollerButtonDataSchema
    override minimumRank: number = RankUtils.min
    override settingId: number = 166
    override name: string = 'shcardscr'

    protected override _isNeedCache: boolean = true
    protected override _objectsPerPage: number = 1
    protected override _stopIfNoObjects: boolean = false

    protected override async _getControlsButtonData(options: ScrollerButtonEditMessageOptions<ShopCard, ShopCardScrollerButtonData>): Promise<Omit<ShopCardScrollerButtonData, "data" | "$typeName" | "$unknown">> {
        const {
            cardId,
            count,
        } = options.data

        return {
            cardId,
            count,
        }
    }

    private _getCurrentCount(shopCard: ShopCard, data: ShopCardScrollerButtonData): number {
        return CardUtils.getCurrentCount(
            data.count,
            shopCard
        )
    }

    protected override async _getRawObjects(options: CallbackQueryActionOptions<ScrollerData>): Promise<Object[]> {
        const {
            chatId,
            data: {
                cardId
            }
        } = options
        return await ShopCardService.getAllByChatIdAndCard(chatId, cardId)
    }

    protected override async _getKeyboard(options: ScrollerButtonEditMessageOptions<Object, ScrollerData>): Promise<InlineKeyboard> {
        const keyboard = new InlineKeyboard()
        const {
            slicedObjects: [shopCard],
            ctx,
            id,
            data,
        } = options

        const bigId = BigInt(id)
        if (shopCard) {
            const currentCount = this._getCurrentCount(shopCard, data)

            keyboard.append(
                await KeyboardCreator.count({
                    maxValue: shopCard.count,
                    avoidNumber: currentCount,
                    callback: async ({ keyboard, index }) => {
                        keyboard.add(
                            this.button({
                                ctx,
                                key: 'button/number',
                                vars: {
                                    value: index
                                },
                                data: {
                                    ...data,
                                    count: index
                                }
                            })
                        )
                    }
                })
            )

            keyboard
                .add(
                    ShopCardBuyButton.button({
                        ctx,
                        data: {
                            id: bigId,
                            count: currentCount,
                            slotId: shopCard.id
                        },
                    })
                )
        }

        keyboard
            .row()
            .add(
                CardCollectionScrollerButton.button({
                    ctx,
                    key: 'card/button/collection',
                    data: {
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

        return keyboard
    }

    protected override async _editMessage(options: ScrollerButtonEditMessageOptions<Object, ScrollerData>): Promise<ScrollerButtonEditMessageResult> {
        const {
            slicedObjects: [shopCard],
            data,
            chatId,
            ctx,
        } = options
        if (!shopCard) {
            return {
                key: 'card/message/reason/no-shop-card'
            }
        }

        const card = await CardService.get(shopCard.card)
        if (!card) {
            return {
                key: 'card/message/not-exist'
            }
        }

        return await CardUtils.showShop({
            shopCard,
            card,
            ctx,
            chatId,
            currentCount: data.count
        })
    }
}

export default new ShopCardScrollerButton()