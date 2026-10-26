import MessagesService from "../../../db/services/message/MessagesService"
import type { MessageActionOptions } from "../../../types/action-options"
import type { ChatTypes } from "../../../types/unions"
import MessageAction from "../base/MessageAction"

export default class NewMessageAction extends MessageAction {
    override chatTypes: ChatTypes[] = ['chat']
    override async execute(options: MessageActionOptions): Promise<boolean | void> {
        const {
            chatId,
            id
        } = options
        if(!chatId) return

        await MessagesService.addForEveryTypes(chatId, id)
    }
}