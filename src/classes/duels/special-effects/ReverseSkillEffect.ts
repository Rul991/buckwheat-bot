import { REVERSE_SKILL_NAME } from '../../../utils/values/consts'
import { GenericSpecialEffectOptions, SpecialEffectGetOptions } from '../../../utils/values/types/duels'
import { MethodExecuteOptions } from '../../../utils/values/types/skills'
import EffectService from '../../db/services/duel/EffectService'
import SpecialEffect from './SpecialEffect'

type Options = {
    methodOptions: MethodExecuteOptions<any[]>
}

export default class extends SpecialEffect<Options> {
    protected _name: string = REVERSE_SKILL_NAME

    protected async _get(options: GenericSpecialEffectOptions<Options>): Promise<number> {
        const result = 0
        const {
            methodOptions
        } = this._options

        const {
            isEffect,
            userId,
            enemyId,
            id: oldId
        } = methodOptions

        const {
            id,
            duel
        } = options

        if (isEffect) return result

        const duelId = duel.id
        const hasEffect = await EffectService.userHas(
            duelId,
            id,
            this._name
        )
        if (!hasEffect) return result

        const newId = oldId == enemyId ? userId : enemyId
        methodOptions.id = newId
        methodOptions.enemyId = userId
        methodOptions.userId = enemyId

        return result + 1
    }
}