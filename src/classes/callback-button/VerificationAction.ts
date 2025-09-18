import AdminUtils from '../../utils/AdminUtils'
import ContextUtils from '../../utils/ContextUtils'
import MessageUtils from '../../utils/MessageUtils'
import { CallbackButtonContext } from '../../utils/values/types'
import LinkedChatService from '../db/services/linkedChat/LinkedChatService'
import UserOldService from '../db/services/user/UserOldService'
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
        const chatId = await LinkedChatService.getCurrent(ctx)
        if(!chatId) return

        if(chatId && ctx.from.id == dataId) {
            await UserOldService.update(chatId, ctx.from.id, true)
            await AdminUtils.unmute(ctx, ctx.from.id)
            await VerificationAction._sendHelloMessage(ctx)
            await MessageUtils.editMarkup(ctx, undefined)
        }
        else {
            await ContextUtils.showCallbackMessageFromFile(ctx)
        }
    }
}