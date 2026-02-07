import { MAX_DEBT, MILLISECONDS_IN_SECOND } from '../../../utils/values/consts';
import { DICE_TIME } from '../../../utils/values/consts'
import ContextUtils from '../../../utils/ContextUtils'
import { CallbackButtonContext } from '../../../utils/values/types/contexts'
import CallbackButtonAction from '../CallbackButtonAction'
import MessageUtils from '../../../utils/MessageUtils'
import CasinoGetService from '../../db/services/casino/CasinoGetService'
import AdminUtils from '../../../utils/AdminUtils'
import CasinoAddService from '../../db/services/casino/CasinoAddService'
import StringUtils from '../../../utils/StringUtils'
import CubeWinsService from '../../db/services/cube/CubeWinsService'
import CubeLosesService from '../../db/services/cube/CubeLosesService'
import CubeData from '../../../interfaces/callback-button-data/CubeData'
import { ZodType } from 'zod'
import { cubeDataSchema } from '../../../utils/values/schemas'
import CubeLastMessageService from '../../db/services/cube/CubeLastMessageService'
import FileUtils from '../../../utils/FileUtils'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'

type DiceAndId = {dice: number, id: number}

type HasEnoughMoneyOptions = {
    ctx: CallbackButtonContext
    chatId: number
    id: number
    money: number
    cost: number
}

export default class CubeYesAction extends CallbackButtonAction<CubeData> {
    protected _buttonTitle?: string | undefined = "Кубы: Да"
    protected _schema: ZodType<CubeData> = cubeDataSchema

    constructor() {
        super()
        this._name = 'cubeyes'
    }

    private static async _sendDice(ctx: CallbackButtonContext, id: number): Promise<number> {
        return await ContextUtils.sendDice(ctx, id)
    }

    private static async _getWinner(
        {dice: userDice, id: userId}: DiceAndId, 
        {dice: replyDice, id: replyId}: DiceAndId
    ): Promise<[number, number, 1 | 2] | null> {
        if(userDice == replyDice) return null

        const boost = userDice == 1 || replyDice == 1 ? 2 : 1

        if((userDice > replyDice && replyDice !== 1) || userDice == 1)
            return [userId, replyId, boost]
        else {
            return [replyId, userId, boost]
        }
    }

    private static _createDiceAndId(id: number, dice: number): DiceAndId {
        return {dice, id}
    }

    private async _hasNotEnoughMoney({ctx, cost, money, id, chatId}: HasEnoughMoneyOptions) {
        if(cost - money > MAX_DEBT) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/cubes/debt-diff.pug',
                {
                    changeValues: await ContextUtils.getUser(chatId, id)
                }
            )
            return true
        }

        return false
    }

    async execute({ctx, data, chatId}: CallbackButtonOptions<CubeData>): Promise<string | void> {
        const {r: replyId, u: userId, m: cost} = data
        
        if(chatId && ctx.from.id == replyId) {
            await MessageUtils.editMarkup(ctx)

            const userMoney = await CasinoGetService.money(chatId, userId)
            const replyMoney = await CasinoGetService.money(chatId, replyId)

            for (const {id, money} of [
                {money: userMoney, id: userId},
                {money: replyMoney, id: replyId},
            ]) {
                if(await this._hasNotEnoughMoney({ctx, cost, money, id, chatId}))
                    return
            }

            const userDice = await CubeYesAction._sendDice(ctx, userId)
            const replyDice = await CubeYesAction._sendDice(ctx, replyId)

            setTimeout(async () => {
                const win = await CubeYesAction._getWinner(
                    CubeYesAction._createDiceAndId(userId, userDice), 
                    CubeYesAction._createDiceAndId(replyId, replyDice), 
                )

                if(!win) {
                    await MessageUtils.answerMessageFromResource(ctx, 'text/commands/cubes/win/tie.pug')
                }
                else {
                    const [winnerId, loserId, boost] = win
                    const money = cost * boost
                    const loserMoney = await CasinoGetService.money(chatId, loserId)
                    const prize = money

                    const changeValues = {
                        ...await ContextUtils.getUser(chatId, winnerId),
                        cost: StringUtils.toFormattedNumber(prize),
                        isFree: cost == 0
                    }

                    if(boost == 1) {
                        await MessageUtils.answerMessageFromResource(
                            ctx, 
                            'text/commands/cubes/win/win.pug',
                            {changeValues}
                        )
                    }
                    else {
                        await MessageUtils.answerMessageFromResource(
                            ctx, 
                            'text/commands/cubes/win/x2.pug',
                            {changeValues}
                        )
                    }

                    await CasinoAddService.money(chatId, winnerId, prize)
                    await CasinoAddService.money(chatId, loserId, -prize)

                    await CubeWinsService.add(chatId, winnerId)
                    await CubeLosesService.add(chatId, loserId)

                    const ids = [userId]

                    ids.forEach(async id => {
                        await CubeLastMessageService.set(chatId, id, undefined)
                    })

                    setTimeout(async () => {
                        if(loserMoney < money) {
                            await MessageUtils.answerMessageFromResource(
                                ctx, 
                                'text/commands/cubes/debt.pug',
                                {
                                    changeValues: {
                                        ...changeValues, 
                                        ...await ContextUtils.getUser(chatId, loserId)
                                    }
                                }
                            )
                            await AdminUtils.gameKick({
                                ctx,
                                id: loserId,
                                chatId
                            })
                        }
                    }, MILLISECONDS_IN_SECOND)
                }
                
            }, DICE_TIME)
        }
        else {
            await ContextUtils.showCallbackMessageFromFile(ctx)
        }
    }
}