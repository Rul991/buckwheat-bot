import SkillMethodTextsUtils from '../../utils/SkillMethodTextsUtils'
import { MethodExecuteOptions, MethodGetTextOptions } from '../../utils/values/types/skills'
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

        return currentChar > -value
    }

    private _getValue(value: number, boost: number) {
        if(value < 0 && boost != this._failBoost) {
            return value
        }
        else {
            return value * boost
        }
    }

    protected async _execute({
        chatId,
        id,
        args: [value],
        boost
    }: MethodExecuteOptions<[number]>): Promise<boolean> {
        await DuelistService.addField(
            chatId,
            id,
            this._characteristic,
            this._getValue(value, boost)
        )

        return true
    }

    protected async _getText({
        args: [value],
        boost
    }: MethodGetTextOptions<[number]>): Promise<string> {
        return await SkillMethodTextsUtils.getAddCharMessage({
            value: this._getValue(value, boost),
            symbol: this._symbol
        })
    }
}