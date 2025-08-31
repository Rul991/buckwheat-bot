import { Context } from 'telegraf'
import { MaybeString, TextContext } from '../../../utils/values/types'
import BuckwheatCommand from '../base/BuckwheatCommand'
import MessageUtils from '../../../utils/MessageUtils'

export default class WrongCommand extends BuckwheatCommand {
    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        await MessageUtils.sendWrongCommandMessage(ctx)
    }
}