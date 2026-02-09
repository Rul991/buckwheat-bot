import FileUtils from '../../../utils/FileUtils'
import { HP_SYMBOLS } from '../../../utils/values/consts'
import { MethodExecuteOptions, MethodGetTextOptions } from '../../../utils/values/types/skills'
import { JavascriptTypes } from '../../../utils/values/types/types'
import DuelistService from '../../db/services/duelist/DuelistService'
import SkillMethod from './SkillMethod'

export default class extends SkillMethod<[number]> {
    args: JavascriptTypes[] = ['number']
    private _minHp = 0

    protected async _preCheck({ }: MethodExecuteOptions<[number]>): Promise<boolean> {
        return true
    }

    protected async _execute({
        chatId,
        id,
        args: [precents]
    }: MethodExecuteOptions<[number]>): Promise<boolean> {
        const currentHp = await DuelistService.getField(
            chatId,
            id,
            'hp'
        )
        const maxCharacteristics = await DuelistService.getMaxCharacteristics(
            chatId,
            id
        )
        const maxHp = maxCharacteristics.hp

        if(currentHp <= this._minHp) {
            const hp = maxHp * (precents / 100)
            await DuelistService.addField(
                chatId,
                id,
                'hp',
                hp
            )
        }

        return true
    }

    protected async _getText({
        args: [precents]
    }: MethodGetTextOptions<[number]>): Promise<string> {
        return await FileUtils.readPugFromResource(
            'text/methods/no-hp-heal.pug',
            {
                changeValues: {
                    precents,
                    heart: HP_SYMBOLS.full,
                    min: this._minHp
                }
            }
        )
    }
}