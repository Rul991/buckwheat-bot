import MessageUtils from '../../../../utils/MessageUtils'
import TimeUtils from '../../../../utils/TimeUtils'
import { TextContext, MaybeString } from '../../../../utils/values/types/types'
import ChatService from '../../../db/services/chat/ChatService'
import PremiumChatService from '../../../db/services/chat/PremiumChatService'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class ChatCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'чат'
        this._description = 'показываю информацию о чате'
        this._aliases = ['группа']
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        const id = ctx.from.id
        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if(!chatId) return

        const chat = await ChatService.get(chatId)
        const isPremium = await PremiumChatService.isPremium(chatId)
        const untilDate = await PremiumChatService.getUntilDate(chatId)

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/chat/info.pug',
            {
                changeValues: {
                    isPremium,
                    rulesLength: chat.rules?.length ?? 0,
                    hasHello: Boolean(chat.hello),
                    untilDate: TimeUtils.formatMillisecondsToTime(untilDate)
                }
            }
        )
    }
}