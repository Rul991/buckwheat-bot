import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../../../utils/values/types'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import MarriageService from '../../../db/services/marriage/MarriageService'
import CallbackButtonManager from '../../../main/CallbackButtonManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class MarryCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'пожениться'
        this._aliases = [
            'свадьба',
            'встречаться',
        ]
        this._replySupport = true
        this._description = 'выполняю услуги ЗАГСа'
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        const replyFrom = ctx.message.reply_to_message?.from
        const userId = ctx.from.id
        const replyId = replyFrom ? replyFrom.id : userId
        
        const chatId = await LinkedChatService.getChatId(ctx, replyId)
        if(!chatId) return

        if(await MarriageService.hasPartner(chatId, userId)) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/marriage/married/user.pug',
                {
                    changeValues: {
                        ...await ContextUtils.getUser(chatId, userId)
                    }
                }
            )
            return
        }

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/marriage/marry/question.pug',
            {
                changeValues: {
                    user: await ContextUtils.getUser(chatId, userId),
                    reply: await ContextUtils.getUser(chatId, replyId),
                },
                inlineKeyboard: await CallbackButtonManager.get('marry', `${userId}_${replyId}`)
            }
        )
    }
}