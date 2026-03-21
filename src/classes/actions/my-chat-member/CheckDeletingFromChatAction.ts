import JsonUtils from '../../../utils/JsonUtils'
import MessageUtils from '../../../utils/MessageUtils'
import { NOT_FOUND_INDEX } from '../../../utils/values/consts'
import { MyChatMemberOptions } from '../../../utils/values/types/action-options'
import ChatSettingsService from '../../db/services/settings/ChatSettingsService'
import TotalService from '../../db/services/total/TotalService'
import MyChatMemberAction from './MyChatMemberAction'

export default class extends MyChatMemberAction {
    async execute(options: MyChatMemberOptions): Promise<void> {
        const {
            newStatus,
            chatId,
            ctx
        } = options

        if (!(newStatus == 'kicked' || newStatus == 'left')) {
            return
        }

        const isDeleteChat = await ChatSettingsService.get<'boolean'>(
            chatId,
            'deleteChat'
        )

        if(!isDeleteChat) {
            return
        }

        const message = await MessageUtils.answerMessageFromResource(
            ctx,
            'text/other/check-deleting-from-chat.pug',
            {
                changeValues: {
                    data: JsonUtils.stringify({
                        ...options,
                        ctx: undefined
                    })
                }
            }
        )
        const hasChat = message.message_id != NOT_FOUND_INDEX
        if(hasChat) {
            return
        }

        await TotalService.deleteChat(chatId)
    }
}