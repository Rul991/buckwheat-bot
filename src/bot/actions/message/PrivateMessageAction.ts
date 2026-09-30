import { UNKNOWN_NAME } from "../../../consts/texts"
import ChatService from "../../../db/services/chat/ChatService"
import LinkedChatService from "../../../db/services/chat/LinkedChatService"
import type { MessageActionOptions } from "../../../types/action-options"
import type { ChatTypes } from "../../../types/types"
import ContextUtils from "../../../utils/bot/ContextUtils"
import MessageUtils from "../../../utils/bot/MessageUtils"
import MessageAction from "../base/MessageAction"

export default class PrivateMessageAction extends MessageAction {
    override chatTypes: ChatTypes[] = ['private']

    override async execute(options: MessageActionOptions): Promise<boolean | void> {
        const {
            chatId,
            ctx,
            id
        } = options

        const chatMember = await ctx.vars.chatMember.get()
        const isNotInChat = ContextUtils.hasStatusByChatMember(
            chatMember,
            [
                'kicked',
                'left',
                'restricted',
            ]
        ) ?? true
        const noLinkedChat = !chatId

        if (!(isNotInChat || noLinkedChat)) {
            return
        }

        if (isNotInChat && chatId) {
            await LinkedChatService.remove(
                id,
                chatId
            )
        }

        const newLinkedChat = await LinkedChatService.relink(id)
        if (!newLinkedChat) {
            await MessageUtils.reply(
                ctx,
                'link/not-linked'
            )
            return false
        }

        const chat = await ChatService.get(newLinkedChat)
        const title = chat?.title ?? UNKNOWN_NAME

        await MessageUtils.reply(
            ctx,
            'link/relinked',
            {
                vars: {
                    title
                }
            }
        )

        return false
    }
}