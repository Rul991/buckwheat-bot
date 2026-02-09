import { DEFEND_SKILL_NAME } from '../../../utils/values/consts'
import { GenericSpecialEffectOptions } from '../../../utils/values/types/duels'
import EffectService from '../../db/services/duel/EffectService'
import SpecialEffect from './SpecialEffect'

type DefendOptions = {
    damage: number
}

export default class extends SpecialEffect<DefendOptions> {
    protected _name: string = DEFEND_SKILL_NAME

    protected async _get(options: GenericSpecialEffectOptions<DefendOptions>): Promise<number> {
        const {
            damage,
            id,
            duel
        } = options
        const duelId = duel.id

        return await EffectService.deleteByNameTargetSteps({
            duelId,
            steps: damage,
            target: id,
            name: this._name
        })
    }
}