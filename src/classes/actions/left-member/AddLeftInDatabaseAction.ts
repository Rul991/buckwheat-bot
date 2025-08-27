import { LeftMemberContext } from '../../../utils/values/types'
import UserLeftService from '../../db/services/user/UserLeftService'
import LeftMemberAction from './LeftMemberAction'

export default class AddLeftInDatabaseAction extends LeftMemberAction {
    async execute(ctx: LeftMemberContext): Promise<void> {
        const user = ctx.message.left_chat_member

        await UserLeftService.update(user.id, true)
    }
}