import Duel from '../../interfaces/schemas/duels/Duel'
import DuelStep from '../../interfaces/schemas/duels/DuelStep'
import ArrayUtils from '../ArrayUtils'

export default class {
    static get(duel: Duel | null) {
        return duel?.steps ?? []
    }

    static getCurrent(steps: DuelStep[]) {
        return ArrayUtils.getLastElement(steps)
    }
}