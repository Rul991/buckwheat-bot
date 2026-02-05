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

type GenerateMultipliedSequenceOptions = {
    startValue?: number
    maxValue: number
    maxLength: number
    values?: number[]
    avoidNumber?: number
}

export default class ArrayUtils {
    static isBounds(index: number, arr: any[]): boolean {
        return index >= FIRST_INDEX && index < arr.length
    }

    static getNearIndex(index: number, arr: any[]): number {
        const numbers = [FIRST_INDEX, -1, 1]

        for (const number of numbers) {
            if (this.isBounds(index + number, arr)) return index + number
        }

        return NOT_FOUND_INDEX
    }

    static range(min: number, max: number, step: number = 1) {
        const result: number[] = []

        for (let i = min; i <= max; i += step) {
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

        for (let i = 0; i < objects.length; i += width) {
            result.push(objects.slice(i, i + width))
        }

        return result
    }

    private static _generateMultipliedSequenceWithoutAvoiding({
        startValue = 1,
        maxValue,
        maxLength,
        values = [2, 5, 10]
    }: GenerateMultipliedSequenceOptions): number[] {
        if (maxLength <= 0 || startValue > maxValue) {
            return []
        }
        else if (maxLength == 1) {
            return [startValue]
        }

        const result: number[] = [startValue]

        while (true) {
            const targetValue = result[result.length - 1]

            for (const value of values) {
                const resultLength = result.length
                if (resultLength >= maxLength - 1) {
                    result.push(maxValue)
                    return result
                }

                const newValue = targetValue * value
                if (newValue >= maxValue) {
                    result.push(maxValue)
                    return result
                }
                else {
                    result.push(newValue)
                }
            }
        }
    }

    static generateMultipliedSequence(options: GenerateMultipliedSequenceOptions): number[] {
        const {
            avoidNumber
        } = options

        const rawNumber = this._generateMultipliedSequenceWithoutAvoiding(options)

        if (avoidNumber === undefined) {
            return rawNumber
        }
        else {
            return rawNumber.filter(v => v != avoidNumber)
        }
    }

    static getLastIndex(arr: any[]) {
        return arr.length - 1
    }

    static getLastElement<T>(arr: T[]): T | undefined {
        return arr[this.getLastIndex(arr)] ?? undefined
    }
}