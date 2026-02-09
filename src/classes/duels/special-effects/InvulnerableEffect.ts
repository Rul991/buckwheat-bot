import { INVULNERABLE_SKILL_NAME } from '../../../utils/values/consts'
import { GenericSpecialEffectOptions } from '../../../utils/values/types/duels'
import EffectService from '../../db/services/duel/EffectService'
import SpecialEffect from './SpecialEffect'

export default class<O extends {} = {}> extends SpecialEffect<O> {
    protected _name: string = INVULNERABLE_SKILL_NAME

    protected async _hasEffect(options: GenericSpecialEffectOptions<O>) {
        const {
            id,
            duel: {
                id: duelId
            }
        } = options

        return await EffectService.userHas(
            duelId,
            id,
            this._name
        )
    }

    protected async _get(options: GenericSpecialEffectOptions<O>): Promise<number> {
        const hasEffect = await this._hasEffect(options)
        return +hasEffect
    }
}