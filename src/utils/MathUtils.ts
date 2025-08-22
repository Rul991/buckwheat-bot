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
}