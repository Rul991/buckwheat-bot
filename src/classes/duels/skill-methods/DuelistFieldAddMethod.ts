import SkillMethodTextsUtils from '../../../utils/SkillMethodTextsUtils'
import { MethodExecuteOptions, MethodGetTextOptions } from '../../../utils/values/types/skills'
import { HpMana, JavascriptTypes } from '../../../utils/values/types/types'
import DuelistService from '../../db/services/duelist/DuelistService'
import SkillMethod from './SkillMethod'

export default class extends SkillMethod<[number, string]> {
    protected _failBoost: number = 0.5
    protected _symbol: string
    protected _characteristic: HpMana

    args: JavascriptTypes[] = ['number']

    constructor (symbol: string, characteristic: HpMana) {
        super()
        this._symbol = symbol
        this._characteristic = characteristic
    }

    protected async _preCheck({ chatId, id, args: [value] }: MethodExecuteOptions<[number, string]>): Promise<boolean> {
        const {
            [this._characteristic]: currentChar
        } = await DuelistService.getCurrentCharacteristics(chatId, id)

        return currentChar >= -value
    }

    protected async _getRawValue({
        args: [value]
    }: MethodExecuteOptions<[number, string]>) {
        return value
    }

    protected async _getValue(options: MethodExecuteOptions<[number, string]>) {
        const {
            boost
        } = options
        
        const value = await this._getRawValue(options)
        return value * boost
    }

    protected async _execute(options: MethodExecuteOptions<[number, string]>): Promise<boolean> {
        const {
            chatId,
            id,
        } = options

        const value = await this._getValue(options)
        await DuelistService.addField(
            chatId,
            id,
            this._characteristic,
            value
        )

        return true
    }

    protected async _getText(options: MethodGetTextOptions<[number, string]>): Promise<string> {
        return await SkillMethodTextsUtils.getAddCharMessage({
            value: await this._getValue(options),
            symbol: this._symbol
        })
    }
}