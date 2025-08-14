import Logging from './Logging'

export default class RandomUtils {
    static range(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    static chance(chance: number): boolean {
        if (chance < 0 || chance > 1) {
            Logging.warn('chance not in range', chance)
            return false
        }
        return Math.random() <= chance
    }

    static choose<T>(arr: T[]): T | null {
        if(!arr.length) return null
        const index = this.range(0, arr.length - 1)
        return arr[index]
    }
}