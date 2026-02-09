import CharacteristicsUtils from '../../../utils/duel/CharacteristicsUtils'
import { MethodExecuteOptions } from '../../../utils/values/types/skills'
import { JavascriptTypes } from '../../../utils/values/types/types'
import LevelService from '../../db/services/level/LevelService'
import EffectMethod from './EffectMethod'

export default class extends EffectMethod<[string, number, number]> {
    args: JavascriptTypes[] = ['string', 'number', 'number']

    protected async _getRawSteps(options: MethodExecuteOptions<[string, number, number]>): Promise<number> {
        const {
            args: [_, steps, perLevel],
            chatId,
            id
        } = options

        const level = await LevelService.get(
            chatId,
            id
        )
        return CharacteristicsUtils.getMaxCharacteristic(
            {
                start: steps,
                up: perLevel
            },
            level
        )
    }
}