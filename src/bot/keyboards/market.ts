import type MarketSlot from "../../db/entities/market/MarketSlot"
import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import MarketBuyButton from "../actions/callback-query/market/MarketBuyButton"
import MarketDeleteButton from "../actions/callback-query/market/MarketDeleteButton"
import MarketShowButton from "../actions/callback-query/market/MarketShowButton"
import MarketSlotScrollerButton from "../actions/callback-query/market/MarketSlotScrollerButton"

export const startMarketKeyboard = KeyboardCreator.create<{
    id: number
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const id = BigInt(data.id)
        keyboard.add(
            MarketSlotScrollerButton.button({
                ctx,
                data: {
                    data: {
                        $typeName: 'ScrollerData',
                        id,
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

export const showMarketKeyboard = KeyboardCreator.create<{
    id: number
    page: number
    slot: MarketSlot
    currentCount: number
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const id = BigInt(data.id)
        const {
            page,
            slot,
            currentCount
        } = data
        const maxValue = slot.count

        keyboard.append(
            await KeyboardCreator.count({
                maxValue,
                avoidNumber: currentCount,
                callback: async options => {
                    const {
                        keyboard,
                        index
                    } = options

                    keyboard.add(
                        MarketShowButton.button({
                            ctx,
                            data: {
                                count: index,
                                page,
                                slotId: slot.id,
                                id,
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

        if (data.id == slot.seller) {
            keyboard.add(
                MarketDeleteButton.button({
                    ctx,
                    data: {
                        id,
                        slotId: slot.id
                    },
                    style: 'danger'
                })
            )
        }
        else {
            keyboard.add(
                MarketBuyButton.button({
                    ctx,
                    data: {
                        count: currentCount,
                        page,
                        id,
                        slotId: slot.id
                    },
                    style: 'primary'
                })
            )
        }

        keyboard
            .row()
            .add(
                MarketSlotScrollerButton.button({
                    ctx,
                    data: {
                        data: {
                            $typeName: 'ScrollerData',
                            id,
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

export const backMarketKeyboard = KeyboardCreator.create<{
    id: number
    page: number
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const id = BigInt(data.id)
        const { page } = data
        keyboard.add(
            MarketSlotScrollerButton.button({
                ctx,
                data: {
                    data: {
                        $typeName: 'ScrollerData',
                        id,
                        data: {
                            case: 'page',
                            value: page
                        }
                    }
                },
                key: 'button/show'
            })
        )
    }
)