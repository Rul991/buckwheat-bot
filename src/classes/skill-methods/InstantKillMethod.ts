import { MethodExecuteOptions } from '../../utils/values/types/skills'
import DuelistService from '../db/services/duelist/DuelistService'
import DamageMethod from './DamageMethod'

export default class extends DamageMethod {
    protected _filename: string = 'instant-kill'
    protected async _getRawDamage({ args: [needPrecents], chatId, id }: MethodExecuteOptions<[number, number]>): Promise<number> {
        const currentChars = await DuelistService.getCurrentCharacteristics(
            chatId, 
            id
        )
        const maxChars = await DuelistService.getMaxCharacteristics(
            chatId,
            id
        )

        const enemyPrecents = currentChars.hp / maxChars.hp * 100
        if(enemyPrecents <= needPrecents) {
            return currentChars.hp
        }
        else {
            return 0
        }
    }
}