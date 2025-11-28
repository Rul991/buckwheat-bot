import { FIRST_INDEX, NOT_FOUND_INDEX } from './values/consts'

type Grid = {
    width: number
}

type NumberGrid = Grid & {
    min: number,
    max: number,
    step?: number
}

type ObjectsGrid<T> = Grid & {
    objects: T[]
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

    static numberGrid({
        min,
        max,
        step,
        width,
    }: NumberGrid): number[][] {
        return this.objectsGrid({
            objects: this.range(min, max, step),
            width
        })
    }

    static objectsGrid<T>({
        objects,
        width
    }: ObjectsGrid<T>): T[][] {
        const result: T[][] = []
        const lastIndex = objects.length - 1
        let temp: T[] = []

        for (let i = 0; i <= lastIndex; i++) {
            const object = objects[i]
            temp.push(object)

            if(temp.length >= width || i >= lastIndex) {
                result.push(temp)
                temp = []
            }
        }

        return result
    }
}