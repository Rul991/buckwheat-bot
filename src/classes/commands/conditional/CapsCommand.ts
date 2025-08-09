import { Context } from 'telegraf'
import { CommandStrings, MaybeString } from '../../../utils/types'
import ContextUtils from '../../../utils/ContextUtils'
import ConditionalCommand from '../base/ConditionalCommand'
import MessageUtils from '../../../utils/MessageUtils'

export default class CapsCommand extends ConditionalCommand {
    condition(_ctx: Context, [firstWord]: CommandStrings): boolean | Promise<boolean> {
        return firstWord.toUpperCase() === firstWord
    }

    async execute(ctx: Context, _: MaybeString): Promise<void> {
        await MessageUtils.answerMessageFromResource(ctx, 'text/commands/caps.html')
    }
}