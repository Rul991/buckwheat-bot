import FileUtils from '../../utils/FileUtils'
import { MethodExecuteOptions, MethodGetTextOptions } from '../../utils/values/types/skills'
import { JavascriptTypes } from '../../utils/values/types/types'
import CasinoAddService from '../db/services/casino/CasinoAddService'
import CasinoGetService from '../db/services/casino/CasinoGetService'
import SkillMethod from './SkillMethod'

export default class extends SkillMethod<[number, number]> {
    args: JavascriptTypes[] = ['number']

    protected async _preCheck({
        chatId,
        id,
        args: [needMoney]
    }: MethodExecuteOptions<[number, number]>): Promise<boolean> {
        const enemyBalance = await CasinoGetService.money(chatId, id)

        return enemyBalance >= needMoney
    }

    protected async _getMoney({
        args: [money]
    }: MethodExecuteOptions<[number, number]>) {
        return money
    }

    protected async _execute(options: MethodExecuteOptions<[number, number]>): Promise<boolean> {
        const {
            chatId,
            id,
            userId,
        } = options
        const money = await this._getMoney(options)

        await CasinoAddService.money(chatId, userId, money)
        await CasinoAddService.money(chatId, id, -money)
        return true
    }

    protected async _getText(options: MethodGetTextOptions<[number, number]>): Promise<string> {
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