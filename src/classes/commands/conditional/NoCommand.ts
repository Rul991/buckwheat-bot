import { Context } from 'telegraf'
import { CommandStrings, MaybeString } from '../../../utils/types'
import ContextUtils from '../../../utils/ContextUtils'
import ConditionalCommand from '../base/ConditionalCommand'

export default class NoCommand extends ConditionalCommand {
    condition(_ctx: Context, [_, command, _other]: CommandStrings): boolean | Promise<boolean> {
        return !command
    }

    async execute(ctx: Context, _: MaybeString): Promise<void> {
        await ContextUtils.answerMessageFromResource(ctx, 'text/commands/no.html')
    }
}