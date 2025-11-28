import { FIRST_INDEX } from './values/consts'

export default class RandomUtils {
    static range(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min
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
}