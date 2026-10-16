import type Item from "../utils/items/Item"
import type { BotContext } from "./bot"
import type InventoryItem from "../db/entities/items/InventoryItem"

export type ItemMaxCount = {
    user?: number
    chat?: number
    use?: number
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

export type ContructorItemDrop = 
    & {
        canDropFromWork?: boolean
        rarity: number
        lootBoxCount?: [number, number] | number
    }

export type ItemDrop = {
    canDropFromWork: boolean
    rarity: number
    canDropFromLootBox: boolean
    lootBoxCount: [number, number]
}

export type RandomItemType = 'lootbox' | 'work'
export type GetRandomItemResult = {
    item: Item | undefined
    count: number
}