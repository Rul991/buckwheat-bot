import { Context } from 'telegraf'
import { MaybeString, TextContext } from '../../../utils/values/types'
import BuckwheatCommand from '../base/BuckwheatCommand'
import { DEV_ID } from '../../../utils/values/consts'
import { exec } from 'node:child_process'
import MessageUtils from '../../../utils/MessageUtils'

export default class UpdateCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'обновись'
        this._isShow = false
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        if(ctx.from.id == +DEV_ID!) {
            exec('git pull && npm run restart:prod', async (_, stdout) => {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/update/stdout.pug',
                    {changeValues: {stdout}}
                )
            })
        }
        else {
            await MessageUtils.sendWrongCommandMessage(ctx)
        }
    }
}