import type Duel from "../../db/entities/duel/Duel"
import type DuelStep from "../../db/entities/duel/DuelStep"

export default class DuelUtils {
    static getPrevStep(duel: Duel): DuelStep | undefined {
        return duel.steps.at(-1)
    }

    static getEnemy(duel: Duel) {
        const prevStep = duel.steps.at(-1)
        if(!prevStep) return duel.firstDuelist

        return prevStep.duelist
    }
}