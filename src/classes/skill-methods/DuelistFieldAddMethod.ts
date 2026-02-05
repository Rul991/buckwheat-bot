import { MethodExecuteOptions } from '../../utils/values/types/skills'
import { HpMana, JavascriptTypes } from '../../utils/values/types/types'
import DuelistService from '../db/services/duelist/DuelistService'
import SkillMethod from './SkillMethod'

export default class extends SkillMethod<[number]> {
    protected _symbol: string
    protected _characteristic: HpMana

    args: JavascriptTypes[] = ['number']

    constructor (symbol: string, characteristic: HpMana) {
        super()
        this._symbol = symbol
        this._characteristic = characteristic
    }

    protected async _preCheck({ chatId, id, args: [value] }: MethodExecuteOptions<[number]>): Promise<boolean> {
        const {
            [this._characteristic]: currentChar
        } = await DuelistService.getCurrentCharacteristics(chatId, id)

        return
    }
}