import SkillAttack from '../../enums/SkillAttack'
import Duelist from '../../interfaces/schemas/duels/Duelist'
import SkillMethodUtils from '../../utils/SkillMethodTextsUtils'
import { JavascriptTypes, MethodExecuteArguments, AsyncOrSync, TypeKeys, SkillMethodGetText, HpMana } from '../../utils/values/types'
import DuelistService from '../db/services/duelist/DuelistService'
import SkillMethod from './SkillMethod'

export default class<T extends any[]> extends SkillMethod<T> {
    args: JavascriptTypes[] = ['number']
    protected _key: HpMana
    protected _symbol: string

    constructor(symbol: string, key: HpMana) {
        super()
        this._key = key
        this._symbol = symbol
    }

    protected _getId({ id }: MethodExecuteArguments<T>) {
        return id
    }

    protected async _preCheck({ }: MethodExecuteArguments<T>): Promise<boolean> {
        return true
    }

    protected async _isAdd(_options: MethodExecuteArguments<T>) {
        return true
    }

    protected async _getValue(options: MethodExecuteArguments<T>): Promise<number> {
        const {
            args: [value],
            attack
        } = options
        const boost = SkillAttack.Crit == attack ? 2 : SkillAttack.Fail ? 0.75 : 1
        return value 
    }

    async _execute(options: MethodExecuteArguments<T>): Promise<boolean> {
        const {
            chatId,
        } = options

        const id = this._getId(options)
        const value = await this._getValue(options)

        if(await this._isAdd(options)) {
            await DuelistService.addField(
                chatId,
                id,
                this._key,
                value
            )
        }

        return true
    }

    async getText(options: MethodExecuteArguments<T> & SkillMethodGetText): Promise<string> {
        const {
            skill: { onEnemy }
        } = options

        const value = await this._getValue(options)

        return await SkillMethodUtils.getAddCharMessage(
            value,
            onEnemy,
            this._symbol
        )
    }

}