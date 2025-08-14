import AdminUtils from '../../utils/AdminUtils'
import { DICE_TIME, RESTART_TIME } from '../../utils/consts'
import ContextUtils from '../../utils/ContextUtils'
import FileUtils from '../../utils/FileUtils'
import MessageUtils from '../../utils/MessageUtils'
import { CallbackButtonContext } from '../../utils/types'
import InlineKeyboardManager from '../main/InlineKeyboardManager'
import CallbackButtonAction from './CallbackButtonAction'

export default class VerificationAction extends CallbackButtonAction {
    constructor() {
        super()
        this._name = 'verify'
    }

    private static async _sendAlert(ctx: CallbackButtonContext): Promise<void> {
        await ctx.answerCbQuery(
            await FileUtils.readTextFromResource('text/alerts/hello.pug')
        )
    }

    private static async _restartButton(ctx: CallbackButtonContext, data: string) {
        await MessageUtils.editMarkup(
            ctx,
            {
                inline_keyboard: await InlineKeyboardManager.get('verify', data)
            }
        )
    }

    private static async _isWin(ctx: CallbackButtonContext, id: number): Promise<boolean> {
        const botDice = await ContextUtils.sendDice(ctx, ctx.botInfo.id)
        const userDice = await ContextUtils.sendDice(ctx, id)

        return userDice >= botDice
    }

    private static async _sendAfterDiceMessage(
        ctx: CallbackButtonContext, 
        filename: 'yes' | 'no'
    ) {
        await MessageUtils.answerMessageFromResource(
            ctx,
            `text/commands/hello/verify/${filename}.pug`,
            {
                changeValues: await ContextUtils.getUser(
                    ctx.from.id, 
                    ctx.from.first_name
                )
            }
        )
    }

    async execute(ctx: CallbackButtonContext, data: string): Promise<void> {
        const dataId = +data

        if(ctx.from.id == dataId) {
            await VerificationAction._sendAlert(ctx)
            await MessageUtils.editMarkup(ctx)
            const isWin = await VerificationAction._isWin(ctx, dataId)

            setTimeout(async () => {
                if(isWin) {
                    await AdminUtils.unmute(ctx, ctx.from.id)
                    await VerificationAction._sendAfterDiceMessage(ctx, 'yes')
                }
                else {
                    await VerificationAction._sendAfterDiceMessage(ctx, 'no')
                    setTimeout(async () => {
                        await VerificationAction._restartButton(ctx, data)
                    }, RESTART_TIME)
                }
            }, DICE_TIME)
        }
        else {
            await ContextUtils.showAlert(ctx)
        }
    }
}