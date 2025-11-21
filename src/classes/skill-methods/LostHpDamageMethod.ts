import { MethodExecuteArguments, SkillMethodGetText } from '../../utils/values/types'
import DuelistService from '../db/services/duelist/DuelistService'
import DamageMethod from './DamageMethod'

export default class extends DamageMethod {
    protected async _getRawDamage({
        args: [damage],
        chatId,
        id
    }: MethodExecuteArguments<[number, number]>): Promise<number> {
        const {hp: currentHp} = await DuelistService.getCurrentCharacteristics(chatId, id)
        const {hp: maxHp} = await DuelistService.getMaxCharacteristics(chatId, id)

        return damage * (1 + (1 - currentHp / maxHp))
    }
}