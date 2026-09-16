import type Item from "../utils/items/Item"
import type { BotContext } from "./bot"
import type InventoryItem from "../db/entities/items/InventoryItem"

export type ItemMaxCount = {
    user?: number
    chat?: number
}

export type Gun = {
    damage: [number, number]
    ammo: Item<any>
}

export type PartialGun =
    & Omit<Gun, 'ammo'>
    & Partial<Pick<Gun, 'ammo'>>

export type Shield = {
    durability: number
}

export type ItemCallbackOptions = {
    ctx: BotContext
    item: Item<any>
    inventoryItem: InventoryItem
    chatId: number
    id: number
    count: number
}
