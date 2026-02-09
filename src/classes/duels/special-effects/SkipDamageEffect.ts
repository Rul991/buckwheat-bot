import { SKIP_DAMAGE_SKILL_NAME } from '../../../utils/values/consts'
import { GenericSpecialEffectOptions } from '../../../utils/values/types/duels'
import EffectService from '../../db/services/duel/EffectService'
import InvulnerableEffect from './InvulnerableEffect'

type Options = {
    isText: boolean
}

export default class extends InvulnerableEffect<Options> {
    protected _name: string = SKIP_DAMAGE_SKILL_NAME

    protected async _hasEffect(options: GenericSpecialEffectOptions<Options>): Promise<boolean> {
        const {
            duel,
            id,
            isText
        } = options
        const duelId = duel.id

        const hasEffect = await EffectService.userHas(
            duelId,
            id,
            this._name
        )

        if (!isText) {
            await EffectService.deleteByNameAndTarget(duelId, this._name, id)
        }
        
        return hasEffect
    }
}