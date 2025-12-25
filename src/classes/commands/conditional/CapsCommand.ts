import { Context } from 'telegraf'
import { CommandStrings, MaybeString } from '../../../utils/values/types/types'
import { TextContext } from '../../../utils/values/types/contexts'
import ContextUtils from '../../../utils/ContextUtils'
import ConditionalCommand from '../base/ConditionalCommand'
import MessageUtils from '../../../utils/MessageUtils'
import { BuckwheatCommandOptions } from '../../../utils/values/types/action-options'

export default class CapsCommand extends ConditionalCommand {
    condition(_ctx: TextContext, [firstWord]: CommandStrings): boolean | Promise<boolean> {
        return firstWord.toUpperCase() === firstWord
    }

    async execute({ ctx }: BuckwheatCommandOptions): Promise<void> {
        await MessageUtils.answerMessageFromResource(ctx, 'text/commands/conditional/caps.pug')
    }
}