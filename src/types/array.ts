export type Grid = {
    width: number
}

export type NumberGrid = Grid & {
    min: number,
    max: number,
    step?: number
}

export type ObjectsGrid<T> = Grid & {
    objects: T[]
}

export type GenerateMultipliedSequenceOptions = {
    startValue?: number
    maxValue: number
    maxLength?: number
    values?: number[]
    avoidNumber?: number
    isAddLastValue?: boolean
}