import { Context } from 'telegraf'
import { MaybeString, TextContext } from '../../../utils/types'
import BuckwheatCommand from '../base/BuckwheatCommand'

export default class PingCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'прием'
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        await ctx.react('🫡', true)
    }
}