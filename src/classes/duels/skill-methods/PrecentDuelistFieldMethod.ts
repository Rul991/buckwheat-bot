import SkillMethodTextsUtils from '../../../utils/SkillMethodTextsUtils'
import { MethodExecuteOptions, MethodGetTextOptions } from '../../../utils/values/types/skills'
import { JavascriptTypes } from '../../../utils/values/types/types'
import DuelistService from '../../db/services/duelist/DuelistService'
import DuelistFieldAddMethod from './DuelistFieldAddMethod'

export default class extends DuelistFieldAddMethod {
    args: JavascriptTypes[] = ['number']

    protected async _getRawValue({ chatId, id, args: [value] }: MethodExecuteOptions<[number, string]>): Promise<number> {
        const maxChars = await DuelistService.getCurrentCharacteristics(
            chatId,
            id
        )
        const maxValue = maxChars[this._characteristic]

        return maxValue * (value / 100)
    }

    protected async _getText(options: MethodGetTextOptions<[number, string]>): Promise<string> {
        return await SkillMethodTextsUtils.getAddCharPrecentsMessage({
            value: await this._getValue(options),
            symbol: this._symbol
        })
    }
}