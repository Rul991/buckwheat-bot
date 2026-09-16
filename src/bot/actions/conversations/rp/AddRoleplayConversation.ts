import type { Conversation } from "@grammyjs/conversations"
import type { Context } from "grammy"
import type { BotContext } from "../../../../types/bot"
import ConversationAction from "../../base/ConversationAction"
import RoleplayService from "../../../../db/services/rp/RoleplayService"
import Roleplay from "../../../../db/entities/rp/Roleplay"
import CommandDescriptionUtils from "../../../../utils/command/CommandDescriptionUtils"
import ConversationUtils from "../../../../utils/conversation/ConversationUtils"
import RoleplayUtils from "../../../../utils/rp/RoleplayUtils"

class AddRoleplayConversation extends ConversationAction {
    override name: string = 'add-roleplay'

    protected override async _execute(conversation: Conversation<BotContext, Context>, ctx: Context): Promise<void> {
        const needId = ctx.from!.id
        const name = await RoleplayUtils.getName(conversation, needId)

        if (CommandDescriptionUtils.hasByName(name)) {
            await ConversationUtils.replyInConversation(
                conversation,
                'rp/already-has',
                {
                    vars: {
                        command: name
                    }
                }
            )
            return
        }

        const text = await RoleplayUtils.getText({
            conversation,
            command: name,
            needId,
        })

        const roleplay = await conversation.external(
            async ctx => RoleplayService.create(new Roleplay({
                id: ctx.vars.chatId!,
                name,
                text,
            }))
        )

        await ConversationUtils.replyInConversation(
            conversation,
            'rp/added',
            {
                vars: {
                    isNew: roleplay.new,
                    command: name
                }
            }
        )
    }
}

export default new AddRoleplayConversation()