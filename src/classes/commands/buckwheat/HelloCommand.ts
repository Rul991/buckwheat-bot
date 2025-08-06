import { Context } from 'telegraf'
import { MaybeString } from '../../../utils/types'
import BuckwheatCommand from '../base/BuckwheatCommand'

export default class HelloCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'прием'
    }

    async execute(ctx: Context, _: MaybeString): Promise<void> {
        await ctx.react('🫡', true)
    }
}