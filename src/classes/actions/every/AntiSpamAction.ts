import EveryMessageAction from './EveryMessageAction'
import AntiSpamService from '../../db/services/antispam/AntiSpamService'
import AdminUtils from '../../../utils/AdminUtils'
import { DEFAULT_MUTE_TIME, MILLISECONDS_IN_SECOND } from '../../../utils/values/consts'
import MessageUtils from '../../../utils/MessageUtils'
import ContextUtils from '../../../utils/ContextUtils'
import { MessageContext } from '../../../utils/values/types/types'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import ChatSettingsService from '../../db/services/settings/ChatSettingsService'
import TimeUtils from '../../../utils/TimeUtils'

export default class AntiSpamAction extends EveryMessageAction {
    async execute(ctx: MessageContext): Promise<void | true> {
        const id = ctx.from.id
        const chatId = await LinkedChatService.getCurrent(ctx)
        if(!chatId) return

        await AntiSpamService.add(id, 'lastMessagesCount', 1)
        const isSpamming = await AntiSpamService.isSpamming(chatId, id)

        const muteTime = (await ChatSettingsService.get<'number'>(
            chatId,
            'antiSpamMute'
        ) ?? (DEFAULT_MUTE_TIME / MILLISECONDS_IN_SECOND)) * MILLISECONDS_IN_SECOND

        if(isSpamming) {
            await AdminUtils.mute(ctx, id, muteTime)
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/spam.pug',
                {
                    changeValues: {
                        ...await ContextUtils.getUser(chatId, id),
                        time: TimeUtils.formatMillisecondsToTime(muteTime)
                    }
                }
            )
            return true
        }
    }
}