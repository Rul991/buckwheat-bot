import type { MyBot } from "../../../types/bot"
import Logger from "../../../utils/logs/Logger"
import type MessageAction from "../../actions/base/MessageAction"
import BaseHandler from "../base/BaseHandler"

export default class MessageHandler extends BaseHandler<MessageAction> {
    override async setup(bot: MyBot): Promise<void> {
        bot.on(
            'message',
            async (ctx, next) => {
                Logger.system('message', ctx.msg)
                const id = ctx.vars.id
                if(!id) return
                const chatId = ctx.vars.chatId

                const isPrivate = ctx.chat.type == 'private'
                for (const [_, action] of this._container) {
                    const canExecute = (isPrivate && action.chatTypes.includes('private'))
                        || (!isPrivate && action.chatTypes.includes('chat'))
                    if(!canExecute) continue
                    
                    const result = await action.execute({
                        ctx,
                        chatId,
                        id
                    }) ?? true
                    if(!result) return
                }

                return next()
            }
        )
    }
}