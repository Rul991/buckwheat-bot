import UserUsernameService from "../../../db/services/user/UserUsernameService"
import type { MessageActionOptions } from "../../../types/action-options"
import Logger from "../../../utils/logs/Logger"
import MessageAction from "../base/MessageAction"

export default class ChangeUsernameMessageAction extends MessageAction {
    override async execute(options: MessageActionOptions): Promise<boolean | void> {
        const {
            ctx,
            chatId,
            id
        } = options
        if (!chatId) return

        const dbUsername = ctx.vars.user?.username ?? ''
        const tgUsername = ctx.from.username?.toLowerCase() ?? ''

        if (dbUsername != tgUsername) {
            await UserUsernameService.set(chatId, id, tgUsername)
            Logger.debug('ChangeUsernameMessageAction', { chatId, id, tgUsername, dbUsername })
        }
    }
}