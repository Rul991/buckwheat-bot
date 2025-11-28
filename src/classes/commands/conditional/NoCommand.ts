import { Context } from 'telegraf'
import { CommandStrings, MaybeString, TextContext } from '../../../utils/values/types/types'
import ContextUtils from '../../../utils/ContextUtils'
import ConditionalCommand from '../base/ConditionalCommand'
import MessageUtils from '../../../utils/MessageUtils'

export default class NoCommand extends ConditionalCommand {
    condition(_ctx: TextContext, [_, command, _other]: CommandStrings): boolean | Promise<boolean> {
        return !command
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        await MessageUtils.answerMessageFromResource(ctx, 'text/commands/conditional/no.pug')
    }
}