import { Context } from 'telegraf'
import { MaybeString } from '../../../utils/types'
import BuckwheatCommand from '../base/BuckwheatCommand'
import MessageUtils from '../../../utils/MessageUtils'

export default class WrongCommand extends BuckwheatCommand {
    async execute(ctx: Context, _: MaybeString): Promise<void> {
        await MessageUtils.answerMessageFromResource(ctx, 'text/commands/wrongCommand.html')
    }
}