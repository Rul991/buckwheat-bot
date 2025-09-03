import ClassUtils from '../../utils/ClassUtils'
import ContextUtils from '../../utils/ContextUtils'
import MessageUtils from '../../utils/MessageUtils'
import { CallbackButtonContext, ClassTypes } from '../../utils/values/types'
import LinkedChatService from '../db/services/linkedChat/LinkedChatService'
import UserClassService from '../db/services/user/UserClassService'
import CallbackButtonAction from './CallbackButtonAction'

export default class ClassAction extends CallbackButtonAction {
    constructor() {
        super()
        this._name = 'class'
    }

    async execute(ctx: CallbackButtonContext, data: string): Promise<void> {
        const chatId = await LinkedChatService.getChatId(ctx)
        if(!chatId) return
                

        const splittedData = data.split('_')

        const classType: ClassTypes = splittedData[0] as any
        const userId = +splittedData[1]

        if(userId == ctx.from.id) {
            await UserClassService.update(chatId, ctx.from.id, classType)
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/actions/class/change.pug',
                {
                    changeValues: {
                        user: await ContextUtils.getUserFromContext(ctx),
                        className: ClassUtils.getName(classType)
                    }
                }
            )
            await ctx.deleteMessage()
        }
        else {
            await ContextUtils.showCallbackMessageFromFile(ctx)
        }
    }
}