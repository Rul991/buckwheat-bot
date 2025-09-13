import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import { CallbackButtonContext } from '../../../utils/values/types'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import CallbackButtonAction from '../CallbackButtonAction'

export default class MarryNoAction extends CallbackButtonAction {
    constructor() {
        super()
        this._name = 'marryno'
    }

    async execute(ctx: CallbackButtonContext, data: string): Promise<string | void> {
        const splittedData = data.split('_', 2).map(v => +v)
        if(splittedData.some(v => isNaN(v))) return

        const [userId, replyId] = splittedData
        const chatId = await LinkedChatService.getChatId(ctx, userId)
        if(!chatId) return

        if(ctx.from.id !== replyId) {
            await ContextUtils.showAlertFromFile(ctx)
            return
        }

        await MessageUtils.editMarkup(ctx)
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/marriage/marry/no.pug',
            {
                changeValues: {
                    user: await ContextUtils.getUser(chatId, userId),
                    reply: await ContextUtils.getUser(chatId, replyId),
                }
            }
        )
    }
}