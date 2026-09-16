import type { MyBot } from "../../../types/bot"
import type DiceAction from "../../actions/base/DiceAction"
import ShowableBaseHandler from "../base/ShowableBaseHandler"

export default class DiceHandler extends ShowableBaseHandler<DiceAction> {
    override async setup(bot: MyBot): Promise<void> {
        bot.on(
            'msg:dice',
            async (ctx, next) => {
                const dice = ctx.msg.dice
                const {
                    emoji: key,
                    value
                } = dice

                const id = ctx.vars.id
                const chatId = ctx.vars.chatId
                if (!id || !chatId) return
                
                const action = this._container.get(key)
                return action ?
                    await action.execute({
                        chatId,
                        id,
                        ctx,
                        value
                    }) :
                    next()
            }
        )
    }
}