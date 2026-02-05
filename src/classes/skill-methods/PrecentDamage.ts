import { MethodExecuteOptions } from '../../utils/values/types/skills'
import DuelistService from '../db/services/duelist/DuelistService'
import DamageMethod from './DamageMethod'

export default class extends DamageMethod {
    protected async _getRawDamage({ args: [precents], chatId, id }: MethodExecuteOptions<[number, number]>): Promise<number> {
        const chars = await DuelistService.getMaxCharacteristics(
            chatId,
            id
        )
        const hp = chars.hp

        const coefficient = precents / 100
        const damage = hp * coefficient

        return damage
    }
}