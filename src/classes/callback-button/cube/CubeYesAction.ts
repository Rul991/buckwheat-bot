import { MILLISECONDS_IN_SECOND, SECONDS_IN_MINUTE } from '../../../utils/values/consts';
import { DICE_TIME } from '../../../utils/values/consts'
import ContextUtils from '../../../utils/ContextUtils'
import { CallbackButtonContext } from '../../../utils/values/types'
import CallbackButtonAction from '../CallbackButtonAction'
import MessageUtils from '../../../utils/MessageUtils'
import CasinoGetService from '../../db/services/casino/CasinoGetService'
import AdminUtils from '../../../utils/AdminUtils'
import CasinoAddService from '../../db/services/casino/CasinoAddService'
import StringUtils from '../../../utils/StringUtils'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'

type DiceAndId = {dice: number, id: number}

export default class CubeYesAction extends CallbackButtonAction {
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

    async execute(ctx: CallbackButtonContext, data: string): Promise<void> {
        const [replyId, userId, cost] = data.split('_').map(val => +val)
        const chatId = await LinkedChatService.getChatId(ctx)
        if(!chatId) return

        if(chatId && ctx.from.id == replyId) {
            await MessageUtils.editMarkup(ctx)

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
                    const loserMoney = await CasinoGetService.getMoney(chatId, loserId)
                    const prize = money > loserMoney ? loserMoney : money

                    const changeValues = {
                        ...await ContextUtils.getUser(chatId, winnerId),
                        cost: StringUtils.toFormattedNumber(prize)
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

                    await CasinoAddService.addMoney(chatId, winnerId, prize)
                    await CasinoAddService.addMoney(chatId, loserId, -prize)

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
                            await AdminUtils.kick(ctx, loserId)
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