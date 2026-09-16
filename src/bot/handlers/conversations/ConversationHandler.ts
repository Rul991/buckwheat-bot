import type { MyBot } from "../../../types/bot"
import type ConversationAction from "../../actions/base/ConversationAction"
import BaseHandler from "../base/BaseHandler"

export default class ConversationHandler extends BaseHandler<ConversationAction> {
    override async setup(bot: MyBot): Promise<void> {
        const options = {}
        for (const [_, action] of this._container) {
            bot.use(await action.execute(options))
        }
    }
}