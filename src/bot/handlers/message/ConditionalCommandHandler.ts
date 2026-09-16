import type { MyBot } from "../../../types/bot"
import CommandUtils from "../../../utils/command/CommandUtils"
import type ConditionalCommand from "../../actions/base/ConditionalCommand"
import BaseHandler from "../base/BaseHandler"

export default class ConditionalCommandHandler extends BaseHandler<ConditionalCommand> {
    override async setup(bot: MyBot): Promise<void> {
        bot.on(
            'message',
            async (ctx, next) => {
                const text = ctx.msg.text
                if(!text) return next()

                const id = ctx.vars.id
                const chatId = ctx.vars.chatId
                if(!(id && chatId)) return next()

                const commandStrings = ctx.vars.commandStrings ?? CommandUtils.getCommandStrings(text)
                if(!commandStrings) return next()

                const options = {
                    ctx,
                    commandStrings,
                    id,
                    chatId
                }

                for (const [_, action] of this._container) {
                    if(await action.condition(options)) {
                        const isNext = await action.execute(options) ?? false
                        if(!isNext) return
                    }
                }

                return next()
            }
        )
    }
}