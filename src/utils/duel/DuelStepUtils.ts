import Duel from '../../interfaces/schemas/duels/Duel'
import DuelStep from '../../interfaces/schemas/duels/DuelStep'
import ArrayUtils from '../ArrayUtils'
import TimeUtils from '../TimeUtils'
import { DUEL_STEP_TIMEOUT } from '../values/consts'
import DuelUtils from './DuelUtils'

export default class {
    static get(duel: Duel | null) {
        return duel?.steps ?? []
    }

    static getCurrent(steps: DuelStep[]) {
        return ArrayUtils.getLastElement(steps)
    }

    static getOther(duel: Duel) {
        const step = this.getCurrent(duel.steps)
        if (!step) {
            return DuelUtils.getRandomDuelist(duel)
        }

        return DuelUtils.getEnemy(duel, step.duelist)
    }

    static isTimeOut(duel: Duel) {
        const step = this.getCurrent(duel.steps)
        if (!step) return false
        const {
            startTime
        } = step
        if (!startTime) return false

        return TimeUtils.isTimeExpired(
            startTime,
            DUEL_STEP_TIMEOUT
        )
    }
}