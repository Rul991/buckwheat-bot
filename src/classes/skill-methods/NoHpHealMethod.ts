import FileUtils from '../../utils/FileUtils'
import { HP_SYMBOLS } from '../../utils/values/consts'
import { JavascriptTypes, MethodExecuteArguments, AsyncOrSync, SkillMethodGetText } from '../../utils/values/types/types'
import DuelistService from '../db/services/duelist/DuelistService'
import SkillMethod from './SkillMethod'

export default class extends SkillMethod<[number]> {
    args: JavascriptTypes[] = ['number']

    protected async _preCheck({ }: MethodExecuteArguments<[number]>): Promise<boolean> {
        return true
    }

    protected async _execute({
        chatId, 
        id,
        args: [argHp]
    }: MethodExecuteArguments<[number]>): Promise<boolean> {
        const key = 'hp'
        const {[key]: hp} = await DuelistService.getCurrentCharacteristics(chatId, id)
        const {[key]: maxHp} = await DuelistService.getMaxCharacteristics(chatId, id)

        const addedHp = maxHp * (argHp / 100)

        if(hp <= 0) {
            await DuelistService.addField(chatId, id, key, addedHp)
        }

        return true
    }

    async getText({
        args: [precents]
    }: MethodExecuteArguments<[number]> & SkillMethodGetText): Promise<string> {
        return await FileUtils.readPugFromResource(
            'text/methods/no-hp-heal.pug',
            {
                changeValues: {
                    precents,
                    heart: HP_SYMBOLS.FULL
                }
            }
        )
    }


}