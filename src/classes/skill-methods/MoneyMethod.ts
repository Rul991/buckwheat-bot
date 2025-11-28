import FileUtils from '../../utils/FileUtils'
import { JavascriptTypes, MethodExecuteArguments, AsyncOrSync, SkillMethodGetText } from '../../utils/values/types/types'
import CasinoAddService from '../db/services/casino/CasinoAddService'
import CasinoGetService from '../db/services/casino/CasinoGetService'
import SkillMethod from './SkillMethod'

export default class extends SkillMethod<[number, number]> {
    args: JavascriptTypes[] = ['number']

    protected async _preCheck({ }: MethodExecuteArguments<[number, number]>): Promise<boolean> {
        return true
    }

    protected async _getMoney({
        chatId,
        id,
        args: [argMoney]
    }: MethodExecuteArguments<[number, number]>) {
        const rawMoney = await CasinoGetService.money(chatId, id)
        return Math.min(argMoney, rawMoney)
    }

    protected async _execute(options: MethodExecuteArguments<[number, number]>): Promise<boolean> {
        const money = await this._getMoney(options)
        const {
            chatId,
            id,
            userId
        } = options

        await CasinoAddService.money(chatId, userId, money)
        await CasinoAddService.money(chatId, id, -money)

        return true
    }

    async getText(options: MethodExecuteArguments<[number, number]> & SkillMethodGetText): Promise<string> {
        const money = await this._getMoney(options)
        return await FileUtils.readPugFromResource(
            'text/methods/money.pug',
            {
                changeValues: {
                    money
                }
            }
        )
    }
}