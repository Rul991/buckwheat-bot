import { Context } from 'telegraf'
import { MaybeString, TextContext } from '../../../utils/types'
import BuckwheatCommand from '../base/BuckwheatCommand'
import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'

export default class EchoCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'эхо'
        this._description = 'повторяю текст'
        this._needData = true
        this._argumentText = 'текст'
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        if(typeof other == 'string' && other.length) {
            await MessageUtils.answerMessageFromResource(
                ctx, 
                'text/commands/echo/echo.pug',
                {changeValues: {other}}
            )
            await ctx.deleteMessage()
        }
        else {
            MessageUtils.answerMessageFromResource(ctx, 'text/commands/echo/echoError.pug')
        }
    }
}