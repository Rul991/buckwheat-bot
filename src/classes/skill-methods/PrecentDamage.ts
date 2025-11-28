import FileUtils from '../../utils/FileUtils'
import { MethodExecuteArguments, SkillMethodGetText } from '../../utils/values/types/types'
import DuelistService from '../db/services/duelist/DuelistService'
import DamageMethod from './DamageMethod'

export default class extends DamageMethod {
    protected async _getRawDamage({
        args: [precents],
        chatId,
        id
    }: MethodExecuteArguments<[number, number]>): Promise<number> {
        const maxChars = await DuelistService.getMaxCharacteristics(chatId, id)

        const maxHp = maxChars.hp
        const damage = maxHp * 0.01 * precents

        return damage
    }

    async getText(options: MethodExecuteArguments<[number, number]> & SkillMethodGetText): Promise<string> {
        const {
            args: [precents],
        } = options
        const damage = await this._getRawDamage(options)

        return await FileUtils.readPugFromResource(
            'text/methods/precent-damage.pug',
            {
                changeValues: {
                    precents,
                    damage
                }
            }
        )
    }
}