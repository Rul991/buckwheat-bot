import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import { CallbackButtonContext } from '../../../utils/values/types'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import MarriageService from '../../db/services/marriage/MarriageService'
import CallbackButtonAction from '../CallbackButtonAction'

export default class MarryYesAction extends CallbackButtonAction {
    constructor() {
        super()
        this._name = 'marryyes'
    }

    async execute(ctx: CallbackButtonContext, data: string): Promise<string | void> {
        const splittedData = data.split('_', 2).map(v => +v)
        if(splittedData.some(v => isNaN(v))) return

        const [userId, replyId] = splittedData
        const chatId = await LinkedChatService.getCurrent(ctx, userId)
        if(!chatId) return

        if(ctx.from.id !== replyId) {
            await ContextUtils.showAlertFromFile(ctx)
            return
        }

        const replyHasPartner = await MarriageService.hasPartner(chatId, replyId)

        if(replyHasPartner) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/marriage/married/user.pug',
                {
                    changeValues: {
                        ...await ContextUtils.getUser(chatId, replyId)
                    }
                }
            )
            return
        }


        await MarriageService.marry(chatId, userId, replyId)
        await MessageUtils.editMarkup(ctx, undefined)
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/marriage/marry/yes.pug',
            {
                changeValues: {
                    reply: await ContextUtils.getUser(chatId, replyId),
                    user: await ContextUtils.getUser(chatId, userId),
                }
            }
        )
    }
}