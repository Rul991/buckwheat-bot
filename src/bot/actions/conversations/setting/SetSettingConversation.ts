import type { Conversation } from "@grammyjs/conversations"
import type { Context } from "grammy"
import type { BotContext } from "../../../../types/bot"
import ConversationAction from "../../base/ConversationAction"
import MessageUtils from "../../../../utils/bot/MessageUtils"

class SetSettingConversation extends ConversationAction {
    override name: string = 'set-setting'
    
    protected override async _execute(conversation: Conversation<BotContext, Context>, _ctx: Context): Promise<void> {
        await conversation.external(ctx => MessageUtils.reply(ctx, 'dev/todo'))
    }
}

export default new SetSettingConversation()