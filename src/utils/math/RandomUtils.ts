import MathUtils from "./MathUtils"

export default class RandomUtils {
    static range(min: number, max: number, afterDot = 0): number {
        if(min >= max) return min
        return MathUtils.floor(Math.random() * (max - min + 1), afterDot) + min
    }

    static chance(chance: number): boolean {
        if(chance <= 0) return false
        else if(chance >= 1) return true
        
        return Math.random() <= chance
    }

    static halfChance(): boolean {
        return this.chance(0.5)
    }

    static choose<T, D = undefined>(arr: readonly T[], defaultValue: D = undefined as D): T | D {
        if(!arr.length) return defaultValue
        const index = this.range(0, arr.length - 1)
        return arr[index]!
    }

    static rarity(chance: number, maxRarity: number) {
        if(chance <= 0) return 0
        let result = 0

        while (result < maxRarity) {
            if (this.chance(chance)) {
                result++
            }
            else {
                break
            }
        }

        return result
    }
}