import RateLimitUtils from '../../../utils/ratelimit/RateLimitUtils'
import { ConditionalCommandOptions } from '../../../utils/values/types/action-options'
import ConditionalCommand from '../base/ConditionalCommand'

export default class extends ConditionalCommand {
    protected async _condition(options: ConditionalCommandOptions): Promise<boolean> {
        const {
            ctx
        } = options

        const id = ctx.from.id
        const chatId = ctx.chat.id

        return RateLimitUtils.isLimit(chatId, id)
    }

    protected async _execute(_: ConditionalCommandOptions): Promise<void> {
        
    }
}