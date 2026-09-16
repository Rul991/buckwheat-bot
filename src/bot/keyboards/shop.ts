import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import ArrayUtils from "../../utils/math/ArrayUtils"
import ShopBuyButton from "../actions/callback-query/shop/ShopBuyButton"
import ShopScrollerButton from "../actions/callback-query/shop/ShopScrollerButton"
import ShopShowButton from "../actions/callback-query/shop/ShopShowButton"

export const startShopKeyboard = KeyboardCreator.create<{
    id: number
}>(
    async ({
        ctx,
        data: {
            id
        },
        keyboard
    }) => {
        const bigId = BigInt(id)

        keyboard.add(
            ShopScrollerButton.button({
                ctx,
                data: {
                    data: {
                        id: bigId,
                        $typeName: 'ScrollerData',
                        data: {
                            case: 'update',
                            value: false
                        }
                    }
                },
                key: 'button/show'
            })
        )
    }
)

export const showShopKeyboard = KeyboardCreator.create<{
    page: number
    id: number
    remainingCount: number
    count: number
    index: number
}>(
    async ({
        keyboard,
        ctx,
        data: {
            page,
            id,
            remainingCount,
            count,
            index
        }
    }) => {
        const bigId = BigInt(id)
        const maxValue = 1_000_000
        const maxLength = 20
        const gridWidth = 5

        if (remainingCount > 0) {
            const sequence = ArrayUtils.generateMultipliedSequence({
                maxValue: Math.min(remainingCount, maxValue),
                maxLength,
                avoidNumber: count,
            })

            const grid = ArrayUtils.objectsGrid({
                width: gridWidth,
                objects: sequence
            })

            for (const row of grid) {
                for (const count of row) {
                    keyboard.add(
                        ShopShowButton.button({
                            ctx,
                            data: {
                                count,
                                id: bigId,
                                index,
                                page,
                            },
                            key: 'button/number',
                            vars: {
                                value: count
                            }
                        })
                    )
                }
                keyboard.row()
            }

            keyboard
                .add(ShopBuyButton.button({
                    ctx,
                    data: {
                        count,
                        id: bigId,
                        index,
                        page
                    }
                }))
                .row()

        }

        keyboard
            .add(
                ShopScrollerButton.button({
                    ctx,
                    data: {
                        data: {
                            id: bigId,
                            data: {
                                case: 'page',
                                value: page
                            },
                            $typeName: 'ScrollerData'
                        }
                    },
                    key: 'button/back'
                })
            )
    }
)