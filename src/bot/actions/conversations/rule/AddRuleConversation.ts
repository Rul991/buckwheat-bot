import { Conversation } from "@grammyjs/conversations"
import type { Context } from "grammy"
import type { BotContext } from "../../../../types/bot"
import ConversationAction from "../../base/ConversationAction"
import ConversationUtils from "../../../../utils/conversation/ConversationUtils"
import { MAX_USER_TEXT_LENGTH } from "../../../../consts/lengths"
import RuleService from "../../../../db/services/chat/RuleService"
import Rule from "../../../../db/entities/chat/Rule"

class AddRuleConversation extends ConversationAction {
    override name: string = 'add-rule'

    protected override async _execute(conversation: Conversation<BotContext, Context>, ctx: Context): Promise<void> {
        const needId = ctx.from!.id
        const text = await ConversationUtils.getFormattedText({
            conversation,
            needId,
            max: MAX_USER_TEXT_LENGTH,
            key: 'rule/add'
        })

        await conversation.external(
            async ctx => {
                const chatId = ctx.vars.chatId!
                await RuleService.create(
                    new Rule({
                        chatId,
                        text
                    })
                )
            }
        )

        await ConversationUtils.replyInConversation(
            conversation,
            'rule/added'
        )
    }
}

export default new AddRuleConversation()