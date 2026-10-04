import type { MyBot } from "../../../types/bot"
import Logger from "../../../utils/logs/Logger"
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
                    const options = {
                        ctx,
                        chatId,
                        id,
                        users: ctx.msg.new_chat_members
                    }

                    Logger.debug(
                        'NewChatmMemberHandler.new_chat_members',
                        options
                    )
                    await action.execute(options)
                }

                return next()
            }
        )
    }
}