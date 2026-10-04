import { MAX_PERCENTS } from "../../consts/number"
import MathUtils from "../math/MathUtils"
import RandomUtils from "../math/RandomUtils"
import Item from "./Item"

export default class ItemUtils {
    private static _maxRarity: number = 0
    private static _rarityChance: number = 0.5

    private static _itemsById: Map<number, Item<any>> = new Map()
    private static _itemsByRarity: Map<number, Item<any>[]> = new Map()

    static setup(items: Item[]) {
        this._itemsById = items.reduce(
            (map, item) => {
                map.set(item.id, item)
                return map
            },
            new Map()
        )

        this._itemsByRarity = items.reduce(
            (map, item) => {
                this._maxRarity = Math.max(item.rarity, this._maxRarity)
                const items = map.getOrInsert(item.rarity, [])
                items.push(item)
                return map
            },
            new Map() as Map<number, Item<any>[]>
        )
    }

    static getRandomItem(): Item<any> | undefined {
        const rarity = RandomUtils.rarity(
            this._rarityChance,
            this._maxRarity
        )

        return RandomUtils.choose(
            this._itemsByRarity.getOrInsert(
                rarity,
                []
            )
        )
    }

    static getDropPercents(item: Item<any>): number {
        const rarity = item.rarity
        if (rarity == Item.notDroppableRarity) return 0

        const length = this._itemsByRarity.getOrInsert(rarity, []).length
        if (!length) return 0

        return MathUtils.floor((this._rarityChance ** rarity) / length * MAX_PERCENTS, 3)
    }

    static get(id: number): Item<any> | undefined {
        return this._itemsById.get(id)
    }
}