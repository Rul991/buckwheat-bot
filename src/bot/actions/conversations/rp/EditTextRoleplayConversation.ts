import type { Conversation } from "@grammyjs/conversations"
import type { Context } from "grammy"
import type { BotContext } from "../../../../types/bot"
import ConversationAction from "../../base/ConversationAction"
import RoleplayUtils from "../../../../utils/rp/RoleplayUtils"
import RoleplayService from "../../../../db/services/rp/RoleplayService"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import type Roleplay from "../../../../db/entities/rp/Roleplay"

class EditTextRoleplayConversation extends ConversationAction<[Roleplay]> {
    override name: string = 'roleplay-edit-text'
    
    protected override async _execute(
        conversation: Conversation<BotContext, Context>, 
        ctx: Context, 
        roleplay: Roleplay, 
    ): Promise<void> {
        const needId = ctx.from!.id
        const text = await RoleplayUtils.getText({
            conversation,
            command: roleplay.name,
            needId
        })

        const newRoleplay = await conversation.external(
            async _ => {
                return await RoleplayService.editText(
                    Uint8Array.fromHex(roleplay._id!.toString('hex')),
                    text
                )
            }
        )
        if(!newRoleplay) return

        await conversation.external(
            async ctx => {
                await MessageUtils.reply(
                    ctx,
                    'rp/text-edited',
                    {
                        vars: {
                            command: roleplay.name
                        }
                    }
                )
            }
        )
    }
}

export default new EditTextRoleplayConversation()