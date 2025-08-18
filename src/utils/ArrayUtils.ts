export default class ArrayUtils {
    static filterAndSort<T extends Record<any, any>>(arr: T[], key: keyof T, maxCount = arr.length) {
        return arr
            .filter((v, i) => v[key] > 0)
            .sort((a, b) => (b[key] - a[key]))
            .filter((v, i) => i < maxCount)
    }

    static isBounds(index: number, arr: any[]): boolean {
        return index >= 0 && index < arr.length
    }

    static getNearIndex(index: number, arr: any[]): number {
        const numbers = [-1, 1]

        for (const number of numbers) {
            if(this.isBounds(index + number, arr)) return index + number
        }

        return -1
    }
}