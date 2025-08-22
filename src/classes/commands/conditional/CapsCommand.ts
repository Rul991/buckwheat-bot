import { Context } from 'telegraf'
import { CommandStrings, MaybeString, TextContext } from '../../../utils/values/types'
import ContextUtils from '../../../utils/ContextUtils'
import ConditionalCommand from '../base/ConditionalCommand'
import MessageUtils from '../../../utils/MessageUtils'

export default class CapsCommand extends ConditionalCommand {
    condition(_ctx: TextContext, [firstWord]: CommandStrings): boolean | Promise<boolean> {
        return firstWord.toUpperCase() === firstWord
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        await MessageUtils.answerMessageFromResource(ctx, 'text/commands/conditional/caps.pug')
    }
}