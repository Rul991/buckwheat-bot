import { Context } from 'telegraf'
import BaseDice from './BaseDice'
import ContextUtils from '../../utils/ContextUtils'
import UserProfileService from '../db/services/user/UserProfileService'
import { DEFAULT_USER_NAME, JACKPOT_PRIZE, LOSE_PRIZE, WIN_PRIZE } from '../../utils/consts'
import CasinoAccountService from '../db/services/casino/CasinoAccountService'
import CasinoAddService from '../db/services/casino/CasinoAddService'
import Casino from '../../interfaces/schemas/Casino'

type ChangeValues = { name: string, link: string }

export default class CasinoDice extends BaseDice {
    private static _winCombinations = [1, 22, 43]
    private static _jackpotNumber = 64

    constructor() {
        super()
        this._name = '🎰'
    }

    private async _sendMessageAndUpdateCasino(
        ctx: Context,
        id: number,
        filename: string,
        count: number,
        values: ChangeValues,
        isWin: boolean
    ): Promise<void> {
        CasinoAddService.addMoney(id, count)
        isWin ? CasinoAddService.addWins(id, 1) : CasinoAddService.addLoses(id, 1)

        await ContextUtils.answerMessageFromResource(ctx, `text/dice/${filename}.html`, {
            ...values,
            count: Math.abs(count).toString(),
        })
    }

    private async _handleCasinoAccount(ctx: Context, id: number): Promise<Casino | null> {
        let [casino] = await CasinoAccountService.updateDailyMoney(id)

        if (!casino) {
            return CasinoAccountService.create(id)
        }
        
        return casino
    }

    private async _checkAndHandleCasinoMoney(ctx: Context, casino: Casino): Promise<boolean> {
        if (casino.money! <= 0) {
            await ctx.deleteMessage()
            return false
        }
        return true
    }

    private async _handleGameResult(
        ctx: Context,
        id: number,
        value: number,
        values: ChangeValues
    ): Promise<void> {
        if (value === CasinoDice._jackpotNumber) {
            await this._sendMessageAndUpdateCasino(ctx, id, 'jackpot', JACKPOT_PRIZE, values, true)
        } 

        else if (CasinoDice._winCombinations.includes(value)) {
            await this._sendMessageAndUpdateCasino(ctx, id, 'win', WIN_PRIZE, values, true)
        } 

        else {
            await this._sendMessageAndUpdateCasino(ctx, id, 'lose', LOSE_PRIZE, values, false)
        }
    }

    private async _checkAndNotifyEndGame(ctx: Context, id: number, values: ChangeValues): Promise<void> {
        const newCasino = await CasinoAccountService.get(id)

        if (newCasino && newCasino.money! <= 0) {
            await ContextUtils.answerMessageFromResource(ctx, `text/dice/end.html`, values)
        }
    }

    async execute(ctx: Context, value: number): Promise<void> {
        const id = ctx.from?.id ?? 0
        const user = await UserProfileService.get(id)
        const name = user?.name ?? DEFAULT_USER_NAME
        const values = { name, link: ContextUtils.getLinkUrl(id) }

        if (ctx.message && 'forward_date' in ctx.message) {
            return
        }

        const casino = await this._handleCasinoAccount(ctx, id)
        if (!casino || !(await this._checkAndHandleCasinoMoney(ctx, casino))) {
            return
        }

        await this._handleGameResult(ctx, id, value, values)
        await this._checkAndNotifyEndGame(ctx, id, values)
    }
}
