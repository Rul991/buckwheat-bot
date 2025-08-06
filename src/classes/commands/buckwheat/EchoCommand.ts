import { Context } from 'telegraf'
import { MaybeString } from '../../../utils/types'
import BuckwheatCommand from '../base/BuckwheatCommand'
import ContextUtils from '../../../utils/ContextUtils'

export default class EchoCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'эхо'
    }

    async execute(ctx: Context, other: MaybeString): Promise<void> {
        if(typeof other == 'string' && other.length) {
            ContextUtils.answerMessageFromResource(
                ctx, 
                'text/commands/echo/echo.html',
                {other}
            )
        }
        else {
            ContextUtils.answerMessageFromResource(ctx, 'text/commands/echo/echoError.html')
        }
    }
}