import CharacteristicsUtils from '../../../utils/duel/CharacteristicsUtils'
import { MethodExecuteOptions } from '../../../utils/values/types/skills'
import { JavascriptTypes } from '../../../utils/values/types/types'
import LevelService from '../../db/services/level/LevelService'
import DamageMethod from './DamageMethod'

export default class extends DamageMethod {
    args: JavascriptTypes[] = ['number', 'number']

    protected async _getRawDamage({ args: [start, up], chatId, id }: MethodExecuteOptions<[number, number]>): Promise<number> {
        const level = await LevelService.get(chatId, id)
        
        return CharacteristicsUtils.getMaxCharacteristic(
            {
                start,
                up
            },
            level
        )
    }
}