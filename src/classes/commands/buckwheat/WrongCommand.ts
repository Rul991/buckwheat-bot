import { Context } from 'telegraf'
import { MaybeString } from '../../../utils/types'
import ContextUtils from '../../../utils/ContextUtils'
import BuckwheatCommand from '../base/BuckwheatCommand'

export default class WrongCommand extends BuckwheatCommand {
    async execute(ctx: Context, _: MaybeString): Promise<void> {
        await ContextUtils.answerMessageFromResource(ctx, 'text/commands/wrongCommand.html')
    }
}