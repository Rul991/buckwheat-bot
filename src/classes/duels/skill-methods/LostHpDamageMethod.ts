import { MethodExecuteOptions } from '../../../utils/values/types/skills'
import DuelistService from '../../db/services/duelist/DuelistService'
import DamageMethod from './DamageMethod'

export default class extends DamageMethod {
    protected async _getRawDamage({
        args: [damage],
        chatId,
        userId
    }: MethodExecuteOptions<[number, number]>): Promise<number> {
        const {
            hp: currentHp
        } = await DuelistService.getCurrentCharacteristics(chatId, userId)
        
        const {
            hp: maxHp
        } = await DuelistService.getMaxCharacteristics(chatId, userId)

        return damage * (1 + (1 - (currentHp / maxHp)))
    }
}