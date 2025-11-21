import { FIRST_INDEX, NOT_FOUND_INDEX } from './values/consts'


type Matrice = {
    min: number,
    max: number,
    step?: number
    width: number
}

export default class ArrayUtils {
    static filterAndSort<T extends Record<any, any>>(arr: T[], key: keyof T, maxCount = arr.length) {
        return arr
            .filter((v) => v[key] > 0)
            .sort((a, b) => (b[key] - a[key]))
            .filter((_, i) => i < maxCount)
    }

    static isBounds(index: number, arr: any[]): boolean {
        return index >= FIRST_INDEX && index < arr.length
    }

    static getNearIndex(index: number, arr: any[]): number {
        const numbers = [FIRST_INDEX, -1, 1]

        for (const number of numbers) {
            if(this.isBounds(index + number, arr)) return index + number
        }

        return NOT_FOUND_INDEX
    }

    static range(min: number, max: number, step: number = 1) {
        const result: number[] = []

        for(let i = min; i <= max; i += step) {
            result.push(i)
        }

        return result
    }

    static matrice({
        min,
        max,
        step = 1,
        width,
    }: Matrice) {
        const result: number[][] = []
        let temp: number[] = []

        for(let i = min; i <= max; i += step) {
            temp.push(i)
            if(temp.length >= width || i >= max) {
                result.push(Array.from(temp))
                temp = []
            }
        }

        return result
    }
}