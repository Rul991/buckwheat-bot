import type Duel from "../../../db/entities/duel/Duel"
import MathUtils from "../../math/MathUtils"

export default class DuelUtils {
    static getEnemy(duel: Duel, currentDuelist: number): number {
        const index = duel.duelists.indexOf(currentDuelist)
        const newIndex = MathUtils.wrap(
            index,
            0,
            duel.duelists.length - 1
        )
        return duel.duelists[newIndex]!
    }

    static onDuel(duel: Duel, id: number): boolean {
        return duel.duelists.indexOf(id) !== -1
    }
}