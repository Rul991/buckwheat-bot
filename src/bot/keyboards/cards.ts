import { MAX_CARD_RARITY, MIN_CARD_RARITY } from "../../consts/cards"
import CardService from "../../db/services/card/CardService"
import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import ArrayUtils from "../../utils/math/ArrayUtils"
import CardCollectionScrollerButton from "../actions/callback-query/card/CardCollectionScrollerButton"
import ShopCardListScrollerButton from "../actions/callback-query/card/ShopCardListScrollerButton"
import SuggestCardButton from "../actions/callback-query/card/SuggestCardButton"
import SuggestedCardScrollerButton from "../actions/callback-query/card/SuggestedCardScrollerButton"
import UnpackCardBoxButton from "../actions/callback-query/card/UnpackCardBoxButton"

export const startCardKeyboard = KeyboardCreator.create<{
    id: number
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const id = BigInt(data.id)
        const count = await CardService.count(true)

        keyboard
            .add(
                CardCollectionScrollerButton.button({
                    ctx,
                    data: {
                        data: {
                            id,
                            $typeName: 'ScrollerData',
                            data: {
                                case: 'update',
                                value: false
                            }
                        }
                    },
                    key: 'card/button/collection',
                })
            )
            .add(
                UnpackCardBoxButton.button({
                    ctx,
                    data: {
                        id
                    }
                })
            )
            .add(
                ShopCardListScrollerButton.button({
                    ctx,
                    data: {
                        data: {
                            id,
                            data: {
                                case: 'update',
                                value: false
                            },
                            $typeName: 'ScrollerData',
                        }
                    },
                    key: 'card/button/shop'
                })
            )

        if(count > 0) {
            keyboard.add(
            SuggestedCardScrollerButton.button({
                ctx,
                data: {
                    data: {
                        id,
                        $typeName: 'ScrollerData',
                        data: {
                            case: 'update',
                            value: false
                        }
                    }
                },
                key: 'card/button/suggested'
            })
        )
        }

        keyboard
            .add(
                SuggestCardButton.button({
                    ctx,
                    data: {
                        id
                    },
                    style: 'success'
                })
            )
        return keyboard.toFlowed(1)
    }
)

export const chooseCardRarityKeyboard = KeyboardCreator.create<{}>(
    async ({
        ctx,
        keyboard
    }) => {
        for (const index of ArrayUtils.range(MIN_CARD_RARITY, MAX_CARD_RARITY)) {
            const data = index.toString()
            keyboard.text(
                ctx.t(
                    'card/button/rarity',
                    {
                        rarity: index
                    }
                ),
                data
            )
        }

        return keyboard.toFlowed(3)
    }
)

export const unpackCardKeyboard = KeyboardCreator.create<{
    id: number
    tries: number
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const id = BigInt(data.id)
        const tries = data.tries
        
        keyboard.add(
            UnpackCardBoxButton.button({
                ctx,
                data: {
                    id,
                    tries
                }
            })
        )
    }
)