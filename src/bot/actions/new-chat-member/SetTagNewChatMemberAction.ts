import UserService from "../../../db/services/user/UserService"
import type { NewChatMemberActionOptions } from "../../../types/action-options"
import AdminUtils from "../../../utils/bot/AdminUtils"
import NewChatMemberAction from "../base/NewChatMemberAction"

export default class SetTagNewChatMemberAction extends NewChatMemberAction {
    override async execute(options: NewChatMemberActionOptions): Promise<void> {
        const {
            chatId,
            users: froms,
            ctx,
        } = options
        const users = await UserService.getAllByIds(
            chatId,
            froms.map(v => v.id)
        )

        for (const [_, user] of users) {
            if(!user.tag) continue

            const id = user.id
            const tag = user.tag

            await AdminUtils.setAdminTag(
                ctx,
                id,
                tag
            )
        }
    }
}