import type { MessageActionOptions } from "../../../types/action-options"
import type { ChatTypes } from "../../../types/types"
import MessageUtils from "../../../utils/bot/MessageUtils"
import MessageAction from "../base/MessageAction"

export default class PrivateMessageAction extends MessageAction {
    override chatTypes: ChatTypes[] = ['private']

    override async execute(options: MessageActionOptions): Promise<boolean | void> {
        const {
            chatId,
            ctx
        } = options

        if(!chatId) {
            await MessageUtils.reply(
                ctx,
                'link/private'
            )
            return false
        }
    }
}