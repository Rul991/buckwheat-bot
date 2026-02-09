import DuelStep from '../../../interfaces/schemas/duels/DuelStep'
import { MethodExecuteOptions } from '../../../utils/values/types/skills'
import { JavascriptTypes } from '../../../utils/values/types/types'
import DamageMethod from './DamageMethod'

export default class extends DamageMethod {
    args: JavascriptTypes[] = ['number']
    protected _filename: string = 'return-damage'

    protected async _getRawDamage({
        args: [precents],
        duel,
        userId
    }: MethodExecuteOptions<[number, number]>): Promise<number> {
        const defaultDamage = 0
        if(!duel) return defaultDamage

        const steps = duel.steps
        const currentStep = steps.at(-1)
        const prevStep = steps.at(-2)
        if(!(currentStep && prevStep)) return defaultDamage

        const getHp = (step: DuelStep) => {
            const {
                characteristics
            } = step

            const yourChars = characteristics.get(`${userId}`)
            if(!yourChars) return defaultDamage

            return yourChars.hp
        }

        const coef = precents / 100
        const prevHp = getHp(prevStep)
        const currentHp = getHp(currentStep)

        return Math.max(
            defaultDamage,
            Math.floor((currentHp - prevHp) / coef)
        )
    }
}