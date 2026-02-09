import { FIRST_INDEX } from './values/consts'

export default class RandomUtils {
    static range(min: number, max: number, step = 0): number {
        if(min >= max) return min
        const mod = 10 ** step
        return Math.floor(Math.random() * (max - min + 1) * mod) / mod + min
    }

    static chance(chance: number): boolean {
        if(chance <= 0) return false
        else if(chance >= 1) return true
        
        return Math.random() <= chance
    }

    static halfChance(): boolean {
        return this.chance(0.5)
    }

    static choose<T>(arr: T[]): T | null {
        if(!arr.length) return null
        const index = this.range(FIRST_INDEX, arr.length - 1)
        return arr[index]
    }

    static getRarity(chance: number, maxRarity: number) {
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