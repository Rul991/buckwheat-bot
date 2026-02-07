import Characteristics from '../../../../interfaces/duel/Characteristics'
import StringUtils from '../../../../utils/StringUtils'
import { HP_SYMBOLS, MAX_STATS_SYMBOLS_COUNT, MANA_SYMBOLS } from '../../../../utils/values/consts'
import { ClassTypes, HpMana } from '../../../../utils/values/types/types'
import DuelistService from '../duelist/DuelistService'

export default class {
    static async get(chatId: number, id: number, classType?: ClassTypes) {
        const currentChars = await DuelistService.getCurrentCharacteristics(chatId, id)
        const maxChars = await DuelistService.getMaxCharacteristics(chatId, id, classType)

        return {
            hp: this.getProgress(currentChars, maxChars, 'hp'),
            mana: this.getProgress(currentChars, maxChars, 'mana')
        }
    }

    static getProgress(current: Characteristics, max: Characteristics, key: HpMana) {
        return StringUtils.getProgressWithNums({
            progress: {
                current: current[key],
                max: max[key]
            },
            symbols: {
                ...(key == 'hp' ? HP_SYMBOLS : MANA_SYMBOLS),
                maxCount: MAX_STATS_SYMBOLS_COUNT
            }
        })
    }
}