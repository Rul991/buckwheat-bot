import FileUtils from '../../utils/FileUtils'
import { MethodExecuteArguments, SkillMethodGetText } from '../../utils/values/types'
import DuelistService from '../db/services/duelist/DuelistService'
import DamageMethod from './DamageMethod'

export default class extends DamageMethod {
    protected async _getRawDamage(options: MethodExecuteArguments<[number, number]>): Promise<number> {
        const {
            args: [],
            chatId,
            id
        } = options

        const { hp } = await DuelistService.getCurrentCharacteristics(
            chatId,
            id,
        )
        const needHp = await this._getNeedHp(options)

        if(hp <= needHp) {
            return needHp
        }
        else {
            return 0
        }
    }

    protected async _getNeedHp({
        args: [precents],
        chatId,
        id
    }: MethodExecuteArguments<[number, number]>): Promise<number> {
        const maxChars = await DuelistService.getMaxCharacteristics(chatId, id)
        const maxHp = maxChars.hp

        return maxHp * 0.01 * precents
    }

    async getText(options: MethodExecuteArguments<[number, number]> & SkillMethodGetText): Promise<string> {
        const {
            args: [precents]
        } = options

        const needHp = await this._getNeedHp(options)

        return await FileUtils.readPugFromResource(
            'text/methods/instant-kill.pug',
            {
                changeValues: {
                    precents,
                    hp: needHp
                }
            }
        )
    }
}