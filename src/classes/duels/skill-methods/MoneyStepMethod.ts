import CharacteristicsUtils from '../../../utils/duel/CharacteristicsUtils'
import { MethodExecuteOptions } from '../../../utils/values/types/skills'
import { JavascriptTypes } from '../../../utils/values/types/types'
import LevelService from '../../db/services/level/LevelService'
import MoneyMethod from './MoneyMethod'

export default class extends MoneyMethod {
    args: JavascriptTypes[] = ['number', 'number']

    protected async _getRawMoney({ args: [money, perLevel], userId, chatId }: MethodExecuteOptions<[number, number]>): Promise<number> {
        const level = await LevelService.get(chatId, userId)
        
        return CharacteristicsUtils.getMaxCharacteristic(
            {
                start: money,
                up: perLevel
            },
            level
        )
    }
}