import AdminUtils from '../../utils/AdminUtils'
import { DICE_TIME, RESTART_TIME } from '../../utils/values/consts'
import ContextUtils from '../../utils/ContextUtils'
import FileUtils from '../../utils/FileUtils'
import MessageUtils from '../../utils/MessageUtils'
import { CallbackButtonContext } from '../../utils/values/types'
import UserOldService from '../db/services/user/UserOldService'
import InlineKeyboardManager from '../main/InlineKeyboardManager'
import CallbackButtonAction from './CallbackButtonAction'

export default class VerificationAction extends CallbackButtonAction {
    constructor() {
        super()
        this._name = 'verify'
    }

    private static async _sendHelloMessage(
        ctx: CallbackButtonContext
    ) {
        await MessageUtils.answerMessageFromResource(
            ctx,
            `text/commands/hello/verify/yes.pug`,
            {
                changeValues: await ContextUtils.getUserFromContext(ctx)
            }
        )
    }

    async execute(ctx: CallbackButtonContext, data: string): Promise<void> {
        const dataId = +data

        if(ctx.from.id == dataId) {
            await UserOldService.update(ctx.from.id, true)
            await AdminUtils.unmute(ctx, ctx.from.id)
            await VerificationAction._sendHelloMessage(ctx)
            await MessageUtils.editMarkup(ctx, undefined)
        }
        else {
            await ContextUtils.showAlert(ctx)
        }
    }
}