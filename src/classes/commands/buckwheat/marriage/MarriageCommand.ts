import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import TimeUtils from '../../../../utils/TimeUtils'
import { TextContext, MaybeString } from '../../../../utils/values/types'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import MarriageService from '../../../db/services/marriage/MarriageService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class MarriageCommand extends BuckwheatCommand {
    constructor () {
        super()
        this._name = 'брак'
        this._aliases = [
            'семья',
            'отношения'
        ]
        this._replySupport = true
        this._description = 'показываю ваше семейное положение'
    }

    private async _getId(ctx: TextContext) {
        const replyFrom = ctx.message.reply_to_message?.from

        if (replyFrom) {
            return replyFrom.id
        }
        else {
            return ctx.from.id
        }
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        const chatId = await LinkedChatService.getCurrent(ctx)
        if (!chatId) return

        const id = await this._getId(ctx)
        const marriage = await MarriageService.get(chatId, id)
        
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/marriage/info.pug',
            {
                changeValues: {
                    isMarried: Boolean(marriage.partnerId),
                    partner: await ContextUtils.getUser(chatId, marriage.partnerId),
                    user: await ContextUtils.getUser(chatId, id),
                    time: TimeUtils.formatMillisecondsToTime(Date.now() - (marriage.startedAt ?? 0))
                }
            }
        )
    }
}