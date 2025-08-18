export default class ArrayUtils {
    static filterAndSort<T extends Record<any, any>>(arr: T[], key: keyof T, maxCount = arr.length) {
        return arr
            .filter((v, i) => v[key] > 0)
            .sort((a, b) => (b[key] - a[key]))
            .filter((v, i) => i < maxCount)
    }
}