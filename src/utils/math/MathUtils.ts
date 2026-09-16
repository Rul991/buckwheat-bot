export default class MathUtils {
    static clamp(value: number, min: number, max: number): number {
        if(value < min)
            return min
        else if(value > max)
            return max
        else
            return value
    }

    static wrap(value: number, min: number, max: number): number {
        if(value > max)
            return min
        else if(value < min)
            return max
        else 
            return value
    }

    static isClamp(value: number, min: number, max: number): boolean {
        return value >= min && value <= max
    }

    static floor(value: number, afterDot: number = 0): number {
        const mod = 10 ** afterDot
        return Math.floor(value * mod) / mod
    }

    static range(min: number, max: number, step = 1): number[] {
        const result: number[] = []

        for (let i = min; i <= max; i += step) {
            result.push(i)
        }

        return result
    }
}