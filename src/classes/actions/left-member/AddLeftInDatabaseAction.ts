import { LeftMemberContext } from '../../../utils/values/types'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import UserLeftService from '../../db/services/user/UserLeftService'
import LeftMemberAction from './LeftMemberAction'

export default class AddLeftInDatabaseAction extends LeftMemberAction {
    async execute(ctx: LeftMemberContext): Promise<void> {
        const user = ctx.message.left_chat_member
        const chatId = await LinkedChatService.getChatId(ctx)
        if(!chatId) return

        await UserLeftService.update(chatId, user.id, true)
    }
}