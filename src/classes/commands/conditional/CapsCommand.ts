import { Context } from 'telegraf'
import { CommandStrings, MaybeString } from '../../../utils/types'
import ContextUtils from '../../../utils/ContextUtils'
import ConditionalCommand from '../base/ConditionalCommand'

export default class CapsCommand extends ConditionalCommand {
    condition(_ctx: Context, [firstWord]: CommandStrings): boolean | Promise<boolean> {
        return firstWord.toUpperCase() === firstWord
    }

    async execute(ctx: Context, _: MaybeString): Promise<void> {
        await ContextUtils.answerMessageFromResource(ctx, 'text/commands/caps.html')
    }
}