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
        const chatId = await LinkedChatService.getChatId(ctx, userId)
        if(!chatId) return

        const userHasPartner = await MarriageService.hasPartner(chatId, userId)
        const replyHasPartner = await MarriageService.hasPartner(chatId, replyId)

        if(userHasPartner) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/marriage/married/user.pug',
                {
                    changeValues: {
                        link: await ContextUtils.getUser(chatId, userId)
                    }
                }
            )
            return
        }

        if(replyHasPartner) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/marriage/married/user.pug',
                {
                    changeValues: {
                        link: await ContextUtils.getUser(chatId, replyId)
                    }
                }
            )
            return
        }
    }
}