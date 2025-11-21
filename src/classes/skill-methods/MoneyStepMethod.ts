import { MethodExecuteArguments } from '../../utils/values/types'
import LevelService from '../db/services/level/LevelService'
import MoneyMethod from './MoneyMethod'

export default class extends MoneyMethod {
    protected async _getMoney({ 
        chatId, 
        args: [money, perLevel],
        userId
    }: MethodExecuteArguments<[number, number]>): Promise<number> {
        const level = await LevelService.get(chatId, userId)
        
        return money + perLevel * (level - 1)
    }
}