import { MILLISECONDS_IN_SECOND, SECONDS_IN_MINUTE } from '../../../utils/consts';
import { DEFAULT_USER_NAME, DICE_TIME } from '../../../utils/consts'
import ContextUtils from '../../../utils/ContextUtils'
import { CallbackButtonContext } from '../../../utils/types'
import UserNameService from '../../db/services/user/UserNameService'
import CallbackButtonAction from '../CallbackButtonAction'
import MessageUtils from '../../../utils/MessageUtils'
import CasinoGetService from '../../db/services/casino/CasinoGetService'
import AdminUtils from '../../../utils/AdminUtils'
import CasinoAddService from '../../db/services/casino/CasinoAddService'
import UserProfileService from '../../db/services/user/UserProfileService'
import CasinoAccountService from '../../db/services/casino/CasinoAccountService'

type DiceAndId = {dice: number, id: number}

export default class CubeYesAction extends CallbackButtonAction {
    constructor() {
        super()
        this._name = 'cubeyes'
    }

    private static async _sendDice(ctx: CallbackButtonContext, id: number): Promise<number> {
        const user = await ContextUtils.getUser(ctx.from.id, ctx.from.first_name)

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/cubes/drop.html',
            {
                changeValues: user
            }
        )

        const {dice: {value: dice}} = await ctx.replyWithDice({
            emoji: '🎲'
        })

        return dice
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

        if(ctx.from.id == replyId) {
            await ctx.editMessageReplyMarkup(undefined)

            const userDice = await CubeYesAction._sendDice(ctx, userId)
            const replyDice = await CubeYesAction._sendDice(ctx, replyId)

            setTimeout(async () => {
                const win = await CubeYesAction._getWinner(
                    CubeYesAction._createDiceAndId(userId, userDice), 
                    CubeYesAction._createDiceAndId(replyId, replyDice), 
                )

                if(!win) {
                    await MessageUtils.answerMessageFromResource(ctx, 'text/commands/cubes/win/tie.html')
                }
                else {
                    const [winnerId, loserId, boost] = win
                    const money = cost * boost
                    const loserMoney = await CasinoGetService.getMoney(loserId)
                    const prize = money > loserMoney ? loserMoney : money

                    const changeValues = {
                        ...await ContextUtils.getUser(winnerId),
                        cost: prize
                    }

                    if(boost == 1) {
                        await MessageUtils.answerMessageFromResource(
                            ctx, 
                            'text/commands/cubes/win/win.html',
                            {changeValues}
                        )
                    }
                    else {
                        await MessageUtils.answerMessageFromResource(
                            ctx, 
                            'text/commands/cubes/win/x2.html',
                            {changeValues}
                        )
                    }

                    await CasinoAddService.addMoney(winnerId, prize)
                    await CasinoAddService.addMoney(loserId, -prize)

                    setTimeout(async () => {
                        if(loserMoney < money) {
                            await MessageUtils.answerMessageFromResource(
                                ctx, 
                                'text/commands/cubes/debt.html',
                                {
                                    changeValues: {
                                        ...changeValues, 
                                        ...await ContextUtils.getUser(loserId)
                                    }
                                }
                            )
                            await AdminUtils.ban(ctx, loserId, MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE)
                        }
                    }, MILLISECONDS_IN_SECOND)
                }
                
            }, DICE_TIME)
        }
        else {
            await ContextUtils.showAlert(ctx)
        }
    }
}