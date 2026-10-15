import Chat from "../../../db/entities/chat/Chat"
import ChatService from "../../../db/services/chat/ChatService"
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
        if (!chatId) return

        const chat = await ctx.vars.chat.get()
        if(!chat) {
            ctx.vars.chat.set(
                await ChatService.create(
                    new Chat({
                        id: chatId,
                        title: ctx.chat.title ?? ctx.chat.first_name
                    })
                )
            )
        }
        
        const user = await ctx.vars.user.get()
        if (user) return

        ctx.vars.user.set(
            await UserService.defaultCreate(
                chatId,
                id,
                ctx.from
            )
        )
    }
}