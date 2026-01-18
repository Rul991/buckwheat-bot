import BaseDice from './BaseDice'
import ContextUtils from '../../utils/ContextUtils'
import { CASINO_TIME, JACKPOT_PRIZE, LOSE_PRIZE, WIN_PRIZE, CASINO_PLUS_BOOST } from '../../utils/values/consts'
import CasinoAccountService from '../db/services/casino/CasinoAccountService'
import CasinoAddService from '../db/services/casino/CasinoAddService'
import Casino from '../../interfaces/schemas/games/Casino'
import MessageUtils from '../../utils/MessageUtils'
import { DiceContext } from '../../utils/values/types/contexts'
import InventoryItemService from '../db/services/items/InventoryItemService'
import LinkedChatService from '../db/services/linkedChat/LinkedChatService'
import ChatSettingsService from '../db/services/settings/ChatSettingsService'
import { DiceOptions } from '../../utils/values/types/action-options'
import UserSettingsService from '../db/services/settings/UserSettingsService'
import { Link } from '../../utils/values/types/types'
import GrindSettingService from '../db/services/settings/GrindSettingService'

type ChangeValues = Link

export default class CasinoDice extends BaseDice {
    private static _winCombinations = [1, 22, 43]
    private static _jackpotCombination = 64

    constructor () {
        super()
        this._name = '🎰'
    }

    private async _isSendMessage(ctx: DiceContext, id: number) {
        return await GrindSettingService.isSendMessage(ctx, id)
    }

    private async _sendMessageAndUpdateCasino(
        ctx: DiceContext,
        id: number,
        filename: string,
        count: number,
        values: ChangeValues,
        isWin: boolean
    ): Promise<void> {
        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if (!chatId) return
        
        await CasinoAddService.money(chatId, id, count)
        await (isWin ? CasinoAddService.wins(chatId, id, 1) : CasinoAddService.loses(chatId, id, 1))
        
        const isSendMessage = await this._isSendMessage(ctx, id)
        if (!isSendMessage) return

        await MessageUtils.answerMessageFromResource(
            ctx,
            `text/dice/${filename}.pug`,
            {
                changeValues: {
                    ...values,
                    count: Math.abs(count).toString(),
                }
            })
    }

    private async _handleCasinoAccount(chatId: number, id: number): Promise<Casino | null> {
        return await CasinoAccountService.get(chatId, id)
    }

    private async _checkAndHandleCasinoMoney(ctx: DiceContext, casino: Casino): Promise<boolean> {
        if (casino.money! <= 0) {
            await MessageUtils.deleteMessage(ctx)
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
        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if (!chatId) return
        const [hasBoost] = await InventoryItemService.use(chatId, id, 'manyCasino')
        const boost = hasBoost ? CASINO_PLUS_BOOST : 1

        if (value === CasinoDice._jackpotCombination) {
            await this._sendMessageAndUpdateCasino(
                ctx,
                id,
                'jackpot',
                JACKPOT_PRIZE * boost,
                values,
                true
            )
        }

        else if (CasinoDice._winCombinations.includes(value)) {
            await this._sendMessageAndUpdateCasino(
                ctx,
                id,
                'win',
                WIN_PRIZE * boost,
                values,
                true
            )
        }

        else {
            const [hasBoost] = await InventoryItemService.use(chatId, id, 'infinityCasino')
            const boost = hasBoost ? 0 : 1

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
        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if (!chatId) return
        const newCasino = await CasinoAccountService.get(chatId, id)

        if (newCasino && newCasino.money! <= 0) {
            await MessageUtils.answerMessageFromResource(ctx, `text/dice/end.pug`, { changeValues: values })
        }
    }

    async execute({ ctx, value }: DiceOptions): Promise<void> {
        const id = ctx.from.id
        const chatId = await LinkedChatService.getCurrent(ctx)
        if (!chatId) return

        const onlyNotPrivate = await ChatSettingsService.get<'boolean'>(
            chatId,
            'privateCasino'
        )
        if (onlyNotPrivate && ctx.chat.type != 'private') {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/dice/cant.pug'
            )
            return
        }

        const values = await ContextUtils.getUserFromContext(ctx)

        if (ctx.message && 'forward_date' in ctx.message) {
            return
        }

        const casino = await this._handleCasinoAccount(chatId, id)
        if (!casino || !(await this._checkAndHandleCasinoMoney(ctx, casino))) {
            return
        }

        setTimeout(async () => {
            await this._handleGameResult(ctx, id, value, values)
            await this._checkAndNotifyEndGame(ctx, id, values)
        }, CASINO_TIME)
    }
}
