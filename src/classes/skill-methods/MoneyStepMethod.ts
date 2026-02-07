import { MethodExecuteOptions } from '../../utils/values/types/skills'
import { JavascriptTypes } from '../../utils/values/types/types'
import MoneyMethod from './MoneyMethod'

export default class extends MoneyMethod {
    args: JavascriptTypes[] = ['number', 'number']
    
    protected async _getMoney({ args: [money, perLevel] }: MethodExecuteOptions<[number, number]>): Promise<number> {
        return money * perLevel
    }
}