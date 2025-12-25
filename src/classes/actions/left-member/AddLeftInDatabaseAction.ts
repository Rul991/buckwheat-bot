import { LeftMemberOptions } from '../../../utils/values/types/action-options'
import UserLeftService from '../../db/services/user/UserLeftService'
import LeftMemberAction from './LeftMemberAction'

export default class AddLeftInDatabaseAction extends LeftMemberAction {
    async execute({ ctx, chatId }: LeftMemberOptions): Promise<void> {
        const user = ctx.message.left_chat_member

        await UserLeftService.update(chatId, user.id, true)
    }
}