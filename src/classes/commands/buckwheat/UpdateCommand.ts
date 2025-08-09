import { Context } from 'telegraf'
import { MaybeString } from '../../../utils/types'
import BuckwheatCommand from '../base/BuckwheatCommand'
import { DEV_ID } from '../../../utils/consts'
import { exec } from 'node:child_process'
import { pid } from 'node:process'
import MessageUtils from '../../../utils/MessageUtils'

export default class UpdateCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'обновись'
    }

    async execute(ctx: Context, _: MaybeString): Promise<void> {
        if(ctx.from?.id == DEV_ID) {
            exec('git pull')
        }
    }
}