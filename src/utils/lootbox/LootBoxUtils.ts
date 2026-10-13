import type Item from "../items/Item"
import RandomUtils from "../math/RandomUtils"

export default class LootBoxUtils {
    static getCount(item: Item): number {
        const [min, max] = item.drop.lootBoxCount
        return RandomUtils.range(min, max)
    }
}