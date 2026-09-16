import type { MyBot } from "../../../types/bot"
import type TelegramCommand from "../../actions/base/TelegramCommand"
import BaseHandler from "../base/BaseHandler"

export default class TelegramCommandHandler extends BaseHandler<TelegramCommand> {
    override async setup(bot: MyBot): Promise<void> {
        for (const [name, action] of this._container) {
            bot.command(
                name,
                async (ctx, next) => {
                    if(!(ctx.vars.id && ctx.vars.chatId)) return
                    if(!ctx.from) return

                    await action.execute({
                        commandStrings: [`/${name}`, ctx.match, ctx.match],
                        id: ctx.vars.id,
                        chatId: ctx.vars.chatId,
                        ctx,
                        replyOrUserFrom: ctx.from,
                        other: ctx.match
                    })
                    return next()
                }
            )
        }
    }
}