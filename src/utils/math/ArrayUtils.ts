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
    isAddLastValue?: boolean
}

export default class ArrayUtils {
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

        for (let i = 0; i < (objects?.length ?? 0); i += width) {
            result.push(objects.slice(i, i + width))
        }

        return result
    }

    private static _generateMultipliedSequenceWithoutAvoiding({
        startValue = 1,
        maxValue,
        maxLength,
        values = [2, 5, 10],
        isAddLastValue = true
    }: GenerateMultipliedSequenceOptions): number[] {
        if (maxLength <= 0 || startValue > maxValue) {
            return []
        }
        else if (maxLength == 1) {
            return [startValue]
        }

        const result: number[] = [startValue]
        const addLastValue = () => {
            if (isAddLastValue) {
                result.push(maxValue)
            }
        }

        while (true) {
            const targetValue = result[result.length - 1]!

            for (const value of values) {
                const resultLength = result.length
                if (resultLength >= maxLength - 1) {
                    addLastValue()
                    return result
                }

                const newValue = targetValue * value
                if (newValue >= maxValue) {
                    addLastValue()
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
}