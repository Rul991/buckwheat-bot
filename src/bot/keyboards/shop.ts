import { MAX_ITEM_COUNT } from "../../consts/number"
import { shopItems } from "../../resources/items/shop"
import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import InventoryShowButton from "../actions/callback-query/inventory/InventoryShowButton"
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
    hasCoupon: boolean
}>(
    async ({
        keyboard,
        ctx,
        data: {
            page,
            id,
            remainingCount,
            count,
            index,
            hasCoupon
        }
    }) => {
        const bigId = BigInt(id)
        const item = shopItems[index]

        if (remainingCount > 0) {
            const balance = await ctx.vars.balance.require()
            const money = balance.total
            const maxValue = Math.min(
                item ? Math.floor(money / item.basePrice) : remainingCount,
                remainingCount,
                MAX_ITEM_COUNT
            )

            keyboard.append(
                await KeyboardCreator.count({
                    maxValue,
                    avoidNumber: count,
                    callback: async ({ keyboard, index: count }) => {
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
                })
            )
        }

        if (item) {
            if (hasCoupon) {
                keyboard
                    .add(ShopBuyButton.button({
                        ctx,
                        data: {
                            count,
                            id: bigId,
                            index,
                            page,
                            useCoupon: hasCoupon
                        }
                    }))
            }

            keyboard
                .add(ShopBuyButton.button({
                    ctx,
                    data: {
                        count,
                        id: bigId,
                        index,
                        page,
                        useCoupon: false
                    }
                }))
                .row()

            keyboard
                .add(InventoryShowButton.button({
                    ctx,
                    data: {
                        itemId: item.id,
                        id: bigId,
                        page: 0
                    },
                    key: 'inventory/button/to-inventory'
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