import type { StartUp } from "../../types/types"

export default class CharacteristicsUtils {
    static calcStartUp(level: number, startup: StartUp<number>): number {
        const {
            start,
            up
        } = startup

        return start + up * (level - 1)
    }
}