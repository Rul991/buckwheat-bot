import { JavascriptTypes, MethodExecuteArguments } from '../../utils/values/types/types'
import LevelService from '../db/services/level/LevelService'
import DamageMethod from './DamageMethod'

export default class extends DamageMethod {
    args: JavascriptTypes[] = ['number', 'number']

    protected async _getRawDamage({ 
        args: [damage, perLevel], 
        chatId, 
        userId 
    }: MethodExecuteArguments<[number, number]>): Promise<number> {
        const level = await LevelService.get(chatId, userId)

        return damage + perLevel * (level - 1)
    }

    async preCheck(options: MethodExecuteArguments<[number, number]>): Promise<boolean> {
        return await this._preCheck(options)
    }
}