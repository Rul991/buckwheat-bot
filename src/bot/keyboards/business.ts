import type BusinessStockMarketSlot from "../../db/entities/business/BusinessStockMarketSlot"
import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import BusinessScrollerButton from "../actions/callback-query/business/BusinessScrollerButton"
import BusinessStockBuyButton from "../actions/callback-query/business/BusinessStockBuyButton"
import BusinessStockMarketScrollerButton from "../actions/callback-query/business/BusinessStockMarketScrollerButton"
import BusinessStockSellButton from "../actions/callback-query/business/BusinessStockSellButton"
import BusinessStockShowButton from "../actions/callback-query/business/BusinessStockShowButton"

export const businessMenuKeyboard = KeyboardCreator.create<{
    id: number
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const id = BigInt(data.id)
        const {

        } = data

        keyboard
            .add(
                BusinessScrollerButton.button({
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
                    key: 'business/button/menu/list'
                }),
                BusinessStockMarketScrollerButton.button({
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
                    key: 'business/button/menu/market'
                })
            )
        return keyboard.toFlowed(1)
    }
)

export const businessShowKeyboard = KeyboardCreator.create<{
    id: number
    page: number
    businessId: number
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const id = BigInt(data.id)
        const {
            page,
            businessId
        } = data

        keyboard
            .add(
                BusinessStockSellButton.button({
                    ctx,
                    data: {
                        businessId,
                        id
                    }
                }),
                BusinessScrollerButton.button({
                    ctx,
                    data: {
                        data: {
                            id,
                            $typeName: 'ScrollerData',
                            data: {
                                case: 'page',
                                value: page
                            }
                        }
                    },
                    key: 'button/back'
                }),
            )
        return keyboard.toFlowed(1)
    }
)

export const businessMarketShowKeyboard = KeyboardCreator.create<{
    id: number
    page: number
    count: number
    slot: BusinessStockMarketSlot
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const id = BigInt(data.id)
        const {
            page,
            count,
            slot: {
                count: slotCount,
                businessId,
                seller
            }
        } = data
        const sellerId = BigInt(seller)

        keyboard.append(
            await KeyboardCreator.count({
                avoidNumber: count,
                maxValue: slotCount,
                callback: async ({ keyboard, index }) => {
                    keyboard.add(
                        BusinessStockShowButton.button({
                            ctx,
                            data: {
                                id,
                                page,
                                businessId,
                                count: index,
                                sellerId
                            },
                            key: 'button/number',
                            vars: {
                                value: index
                            }
                        })
                    )
                }
            })
        )

        keyboard
            .add(
                BusinessStockBuyButton.button({
                    ctx,
                    data: {
                        businessId,
                        id,
                        sellerId,
                        page,
                        count
                    }
                })
            )
            .row()
            .add(
                BusinessStockMarketScrollerButton.button({
                    ctx,
                    data: {
                        data: {
                            id,
                            $typeName: 'ScrollerData',
                            data: {
                                case: 'page',
                                value: page
                            }
                        }
                    },
                    key: 'button/back'
                })
            )
    }
)