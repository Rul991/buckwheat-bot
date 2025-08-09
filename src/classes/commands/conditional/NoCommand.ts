import { Context } from 'telegraf'
import { CommandStrings, MaybeString } from '../../../utils/types'
import ContextUtils from '../../../utils/ContextUtils'
import ConditionalCommand from '../base/ConditionalCommand'
import MessageUtils from '../../../utils/MessageUtils'

export default class NoCommand extends ConditionalCommand {
    condition(_ctx: Context, [_, command, _other]: CommandStrings): boolean | Promise<boolean> {
        return !command
    }

    async execute(ctx: Context, _: MaybeString): Promise<void> {
        await MessageUtils.answerMessageFromResource(ctx, 'text/commands/no.html')
    }
}