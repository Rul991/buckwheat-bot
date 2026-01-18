import ConditionalCommand from '../base/ConditionalCommand'
import MessageUtils from '../../../utils/MessageUtils'
import { ConditionalCommandOptions } from '../../../utils/values/types/action-options'

export default class CapsCommand extends ConditionalCommand {
    protected async _condition({ strings: [firstWord] }: ConditionalCommandOptions): Promise<boolean> {
        return firstWord.toUpperCase() === firstWord
    }

    protected async _execute({ ctx }: ConditionalCommandOptions): Promise<void> {
        await MessageUtils.answerMessageFromResource(ctx, 'text/commands/conditional/caps.pug')
    }
}