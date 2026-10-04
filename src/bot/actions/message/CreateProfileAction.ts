import UserService from "../../../db/services/user/UserService"
import type { MessageActionOptions } from "../../../types/action-options"
import type { ChatTypes } from "../../../types/unions"
import MessageAction from "../base/MessageAction"

export default class CreateProfileAction extends MessageAction {
    override chatTypes: ChatTypes[] = ['chat']

    override async execute(options: MessageActionOptions): Promise<boolean | void> {
        const {
            chatId,
            id,
            ctx
        } = options
        const user = await ctx.vars.user.get()

        if (user) return
        if (!chatId) return

        ctx.vars.user.set(
            await UserService.defaultCreate(
                chatId,
                id,
                ctx.from
            )
        )
    }
}