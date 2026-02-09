import StringUtils from '../../../utils/StringUtils'
import { DAMAGE_UP_SKILL_NAME } from '../../../utils/values/consts'
import { GenericSpecialEffectOptions } from '../../../utils/values/types/duels'
import EffectService from '../../db/services/duel/EffectService'
import SpecialEffect from './SpecialEffect'

type DamageUpOptions = {

}

export default class extends SpecialEffect<DamageUpOptions> {
    protected _name: string = DAMAGE_UP_SKILL_NAME

    protected async _get(options: GenericSpecialEffectOptions<DamageUpOptions>): Promise<number> {
        const {
            id,
            duel
        } = options

        const duelId = duel.id
        const targetEffects = await EffectService.getByTarget(
            duelId,
            id
        )
        let result = 0

        for (const effect of targetEffects) {
            const {
                name
            } = effect

            if(name.startsWith(this._name)) {
                const startIndex = this._name.length
                const stringPrecents = name.slice(startIndex)
                const precents = StringUtils.getNumberFromString(stringPrecents, 0)

                result += precents
            }
        }

        return result / 100
    }
}