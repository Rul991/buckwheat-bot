type WithId = {
    id: string
}

export type Gun = {
    damage: [number, number]
    ammo?: string
}
export type GunWithId = Gun & WithId

export type Shield = {
    triggeringChance: number
}
export type ShieldWithId = Shield & WithId

export type InventoryItemDescription = {
    name: string
    type: InventoryItemType
    description: string
    material?: {
        rarity: number
    }
    maxCount?: {
        user?: number
        chat?: number
    }
    gun?: Gun
    shield?: Shield
    basePrice: number
}

export type InventoryItemDescriptionWithId = InventoryItemDescription & WithId

export type ShowableItem = InventoryItemDescription & {
    itemId: string
    countText: string
    count: number
}

export type InventoryItemType = 'consumable' | 'manyInfinity'
export type InventoryItemCountType = 'user' | 'chat'