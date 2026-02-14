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

        const duelId = duel?.id
        const hasEffect = duelId ?
            await EffectService.userHas(
                duelId,
                id,
                effectId
            ) :
            true

        if (hasEffect) {
            return value
        }
        else {
            return 0
        }
    }
}