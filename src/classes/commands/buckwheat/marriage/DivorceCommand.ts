import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../../../utils/values/types'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import MarriageService from '../../../db/services/marriage/MarriageService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class DivorceCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'развестись'
        this._aliases = [
            'развод',
            'расстаться'
        ]
        this._replySupport = true
        this._description = 'выполняю услуги ЗАГСа'
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        const chatId = await LinkedChatService.getCurrent(ctx)
        if(!chatId) return

        const reply = ctx.message.reply_to_message?.from
        const userId = ctx.from.id
        const replyId = reply ? reply.id : userId

        const isDivorced = await MarriageService.divorce(chatId, userId, replyId)
        const changeValues = {
            user: await ContextUtils.getUser(chatId, userId),
            reply: await ContextUtils.getUser(chatId, replyId),
        }

        if(isDivorced) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/marriage/divorce/divorce.pug',
                {changeValues}
            )
        }
        else {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/marriage/divorce/not-equal.pug',
                {changeValues}
            )
        }
    }
}