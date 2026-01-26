import RateLimitUtils from '../../../utils/ratelimit/RateLimitUtils'
import { ConditionalCommandOptions } from '../../../utils/values/types/action-options'
import ConditionalCommand from '../base/ConditionalCommand'

export default class extends ConditionalCommand {
    protected async _condition(options: ConditionalCommandOptions): Promise<boolean> {
        const id = options.id
        return RateLimitUtils.isLimit(id)
    }

    protected async _execute(_: ConditionalCommandOptions): Promise<void> {
        
    }
}