import RoleplayService from "../../../../db/services/rp/RoleplayService"
import UserService from "../../../../db/services/user/UserService"
import type { ConditionalCommandOptions } from "../../../../types/action-options"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import ConditionalCommand from "../../base/ConditionalCommand"

export default class RoleplayConditionalCommand extends ConditionalCommand {
    override async condition(options: ConditionalCommandOptions): Promise<boolean> {
        const {
            commandStrings,
            chatId,
            ctx
        } = options
        const [_, command] = commandStrings
        if(!command) return false

        const roleplay = await RoleplayService.getByName(
            chatId,
            command
        )
        
        ctx.vars.roleplay = roleplay
        return Boolean(roleplay)
    }

    override async execute(options: ConditionalCommandOptions): Promise<boolean | void> {
        const {
            commandStrings: [_, _command, other],
            ctx,
            id,
            chatId
        } = options

        const user = ctx.vars.user!
        const roleplay = ctx.vars.roleplay!

        const replyId = (ctx.msg.reply_to_message?.from ?? ctx.from).id
        const reply = id == replyId ?
            user :
            await UserService.get(chatId, replyId)

        await MessageUtils.reply(
            ctx,
            'rp/command',
            {
                vars: {
                    user,
                    reply,
                    roleplay,
                    other
                }
            }
        )
    }
}