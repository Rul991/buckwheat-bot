import BaseDice from './BaseDice'
import ContextUtils from '../../utils/ContextUtils'
import UserProfileService from '../db/services/user/UserProfileService'
import { DEFAULT_USER_NAME, CASINO_TIME, JACKPOT_PRIZE, LOSE_PRIZE, WIN_PRIZE, CASINO_BOOST } from '../../utils/consts'
import CasinoAccountService from '../db/services/casino/CasinoAccountService'
import CasinoAddService from '../db/services/casino/CasinoAddService'
import Casino from '../../interfaces/schemas/Casino'
import MessageUtils from '../../utils/MessageUtils'
import { DiceContext } from '../../utils/types'
import InventoryItemService from '../db/services/items/InventoryItemService'

type ChangeValues = { name: string, link: string }

export default class CasinoDice extends BaseDice {
    private static _winCombinations = [1, 22, 43]
    private static _jackpotCombination = 64

    constructor() {
        super()
        this._name = '🎰'
    }

    private async _sendMessageAndUpdateCasino(
        ctx: DiceContext,
        id: number,
        filename: string,
        count: number,
        values: ChangeValues,
        isWin: boolean
    ): Promise<void> {
        CasinoAddService.addMoney(id, count)
        isWin ? CasinoAddService.addWins(id, 1) : CasinoAddService.addLoses(id, 1)

        await MessageUtils.answerMessageFromResource(
            ctx, 
            `text/dice/${filename}.html`, 
            {
            changeValues: {
                ...values,
                count: Math.abs(count).toString(),
            }
        })
    }

    private async _handleCasinoAccount(id: number): Promise<Casino | null> {
        return await CasinoAccountService.create(id)
    }

    private async _checkAndHandleCasinoMoney(ctx: DiceContext, casino: Casino): Promise<boolean> {
        if (casino.money! <= 0) {
            await ctx.deleteMessage()
            return false
        }
        return true
    }

    private async _handleGameResult(
        ctx: DiceContext,
        id: number,
        value: number,
        values: ChangeValues
    ): Promise<void> {
        const boost = await InventoryItemService.use(id, 'manyCasino') ? CASINO_BOOST : 0
        if (value === CasinoDice._jackpotCombination) {
            await this._sendMessageAndUpdateCasino(
                ctx, 
                id, 
                'jackpot', 
                JACKPOT_PRIZE + boost, 
                values, 
                true
            )
        } 

        else if (CasinoDice._winCombinations.includes(value)) {
            await this._sendMessageAndUpdateCasino(
                ctx, 
                id, 
                'win', 
                WIN_PRIZE + boost, 
                values, 
                true
            )
        } 

        else {
            const boost = await InventoryItemService.use(id, 'infinityCasino') ? 0 : 1
            await this._sendMessageAndUpdateCasino(
                ctx, 
                id, 
                'lose', 
                LOSE_PRIZE * boost, 
                values, 
                false
            )
        }
    }

    private async _checkAndNotifyEndGame(ctx: DiceContext, id: number, values: ChangeValues): Promise<void> {
        const newCasino = await CasinoAccountService.get(id)

        if (newCasino && newCasino.money! <= 0) {
            await MessageUtils.answerMessageFromResource(ctx, `text/dice/end.html`, {changeValues: values})
        }
    }

    async execute(ctx: DiceContext, value: number): Promise<void> {
        const id = ctx.from?.id ?? 0
        const values = await ContextUtils.getUser(id, ctx.from.first_name)

        if (ctx.message && 'forward_date' in ctx.message) {
            return
        }

        const casino = await this._handleCasinoAccount(id)
        if (!casino || !(await this._checkAndHandleCasinoMoney(ctx, casino))) {
            return
        }

        setTimeout(async () => {
            await this._handleGameResult(ctx, id, value, values)
            await this._checkAndNotifyEndGame(ctx, id, values)
        }, CASINO_TIME)
    }
}
