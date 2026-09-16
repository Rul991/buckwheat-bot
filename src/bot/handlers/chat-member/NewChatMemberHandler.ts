import type { MyBot } from "../../../types/bot"
import type NewChatMemberAction from "../../actions/base/NewChatMemberAction"
import BaseHandler from "../base/BaseHandler"

export default class NewChatMemberHandler extends BaseHandler<NewChatMemberAction> {
    override async setup(bot: MyBot): Promise<void> {
        bot.on(
            ':new_chat_members',
            async (ctx, next) => {
                const id = ctx.vars.id
                const chatId = ctx.vars.chatId
                if (!(id && chatId)) return next()

                for (const [_, action] of this._container) {
                    await action.execute({
                        ctx,
                        chatId,
                        id,
                        users: ctx.msg.new_chat_members
                    })
                }

                return next()
            }
        )
    }
}