import type Item from "../../utils/items/Item"
import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import GunSetButton from "../actions/callback-query/gun/GunSetButton"
import InventoryGiftButton from "../actions/callback-query/inventory/InventoryGiftButton"
import InventoryScrollerButton from "../actions/callback-query/inventory/InventoryScrollerButton"
import InventoryUseButton from "../actions/callback-query/inventory/InventoryUseButton"

export const startInventoryKeyboard = KeyboardCreator.create<{
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
            InventoryScrollerButton.button({
                ctx,
                data: {
                    data: {
                        $typeName: 'ScrollerData',
                        id: bigId,
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

export const showItemKeyboard = KeyboardCreator.create<{
    id: number,
    item: Item,
    page: number
    count: number
}>(
    async ({
        ctx,
        data: {
            id,
            page,
            item,
            count
        },
        keyboard
    }) => {
        const itemId = item.id
        const bigId = BigInt(id)

        if(item.gun && count > 0) {
            keyboard
                .add(GunSetButton.button({
                    ctx,
                    data: {
                        id: bigId,
                        itemId
                    }
                }))
                .row()
        }

        if (item.canUse) {
            keyboard
                .add(InventoryUseButton.button({
                    ctx,
                    data: {
                        id: bigId,
                        itemId: itemId
                    }
                }))
                .row()
        }

        keyboard
            .add(
                InventoryGiftButton.button({
                    ctx,
                    data: {
                        id: bigId,
                        itemId,
                        page
                    }
                })
            )
            .row()
            .add(
                InventoryScrollerButton.button({
                    ctx,
                    data: {
                        data: {
                            id: bigId,
                            data: {
                                case: 'page',
                                value: page
                            },
                            $typeName: 'ScrollerData',
                        }
                    },
                    key: 'button/back'
                })
            )
            .row()
    }
)

export const gunsKeyboard = KeyboardCreator.create<{
    id: number
    guns: Item[]
}>(
    async ({
        data: {
            id,
            guns
        },
        ctx,
        keyboard
    }) => {
        const bigId = BigInt(id)
        for (const gun of guns) {
            keyboard
                .add(GunSetButton.button({
                    ctx,
                    data: {
                        id: bigId,
                        itemId: gun.id
                    },
                    vars: {
                        item: gun.getVars(ctx)
                    },
                    key: 'items/system/full-title'
                }))
                .row()
        }
    }
)