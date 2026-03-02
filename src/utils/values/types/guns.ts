export type Gun = {
    damage: [number, number]
    ammo?: string
}

export type GunWithId = Gun & {
    id: string
}