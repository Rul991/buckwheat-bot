import { CHANNEL_BOT_ID, CHANNEL_ID } from "../../../consts/number"
import type { MessageActionOptions } from "../../../types/action-options"
import MessageAction from "../base/MessageAction"

export default class ChannelMessageAction extends MessageAction {
    override async execute(options: MessageActionOptions): Promise<boolean | void> {
        const {
            ctx,
            id
        } = options
        
        const replyFrom = ctx.msg.reply_to_message?.from
        const replyId = replyFrom?.id
        
        return (id != CHANNEL_ID && replyId != CHANNEL_ID) && (id != CHANNEL_BOT_ID && replyId != CHANNEL_BOT_ID)
    }
}