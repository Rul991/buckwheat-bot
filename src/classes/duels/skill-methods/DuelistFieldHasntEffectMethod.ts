import { MethodExecuteOptions } from '../../../utils/values/types/skills'
import { JavascriptTypes } from '../../../utils/values/types/types'
import EffectService from '../../db/services/duel/EffectService'
import DuelistFieldAddMethod from './DuelistFieldAddMethod'

export default class extends DuelistFieldAddMethod {
    args: JavascriptTypes[] = ['number', 'string']

    protected async _getRawValue(options: MethodExecuteOptions<[number, string]>): Promise<number> {
        const { 
            args: [value, effectId], 
            duel,
            id, 
        } = options
        if(!duel) return 0

        const duelId = duel.id
        const hasEffect = await EffectService.userHas(
            duelId,
            id,
            effectId
        )

        if(hasEffect) {
            return value
        }
        else {
            return 0
        }
    }
}