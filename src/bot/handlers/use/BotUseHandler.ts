import type { MyBot } from "../../../types/bot"
import type BotUseAction from "../../actions/base/UseAction"
import BaseHandler from "../base/BaseHandler"

export default class BotUseHandler extends BaseHandler<BotUseAction> {
    override async setup(bot: MyBot): Promise<void> {
        bot.use(
            async (ctx, next) => {
                const id = ctx.vars.id
                const chatId = ctx.vars.chatId
                if(!(id && chatId)) return next()
                
                const options = {
                    ctx,
                    chatId,
                    id
                }
                for (const [_, action] of this._container) {
                    const isContinue = await action.execute(options) ?? true
                    if(!isContinue) return
                }
                return next()
            }
        )
    }
}