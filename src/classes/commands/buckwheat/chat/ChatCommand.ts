import MessageUtils from '../../../../utils/MessageUtils'
import StringUtils from '../../../../utils/StringUtils'
import TimeUtils from '../../../../utils/TimeUtils'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'
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

    async execute({ ctx, chatId, id }: BuckwheatCommandOptions): Promise<void> {
        const chat = await ChatService.get(chatId)
        const isPremium = await PremiumChatService.isPremium(chatId)
        const untilDate = await PremiumChatService.getUntilDate(chatId)

        const rulesLength = chat.rules?.length ?? 0
        const hasHello = Boolean(chat.hello)

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/chat/info.pug',
            {
                changeValues: {
                    isPremium,
                    hasHello,
                    untilDate: TimeUtils.formatMillisecondsToTime(untilDate),
                    rulesLength: StringUtils.toFormattedNumber(rulesLength),
                }
            }
        )
    }
}