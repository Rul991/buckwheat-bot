import { Context } from 'telegraf'
import BaseDice from './BaseDice'

export default class WrongDice extends BaseDice {
    async execute(ctx: Context, _: number): Promise<void> {
        if (ctx.message && 'forward_date' in ctx.message) {
            return
        }

        await ctx.deleteMessage(ctx.message?.message_id ?? -1)
    }
}