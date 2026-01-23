import { MyChatMemberOptions } from '../../../utils/values/types/action-options'
import ChatSettingsService from '../../db/services/settings/ChatSettingsService'
import TotalService from '../../db/services/total/TotalService'
import MyChatMemberAction from './MyChatMemberAction'

export default class extends MyChatMemberAction {
    async execute(options: MyChatMemberOptions): Promise<void> {
        const {
            newStatus,
            chatId,
        } = options

        if (!(newStatus == 'kicked' || newStatus == 'left')) {
            return
        }

        const isDeleteChat = await ChatSettingsService.get<'boolean'>(chatId, 'deleteChat')
        if(!isDeleteChat) return

        await TotalService.deleteChat(chatId)
    }
}