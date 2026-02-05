import RandomUtils from '../RandomUtils'
import { Duelists } from '../values/types/duels'

export default class DuelUtils {
    static getEnemy(duel: Duelists, id: number): number {
        return duel.firstDuelist == id ? duel.secondDuelist : duel.firstDuelist
    }

    static getRandomDuelist({
        firstDuelist,
        secondDuelist
    }: Duelists) {
        return RandomUtils.choose([firstDuelist, secondDuelist])!
    }
}