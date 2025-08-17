export default class ArrayUtils {
    static filterAndSort<T extends Record<any, any>>(arr: T[], key: keyof T, maxCount = -1) {
        const maxLength = maxCount == -1 ? arr.length : maxCount

        return arr
            .filter((v, i) => (v[key] ?? 0) > 0 && i < maxLength)
            .sort((a, b) => ((b[key] ?? 0) - (a[key] ?? 0)))
    }
}