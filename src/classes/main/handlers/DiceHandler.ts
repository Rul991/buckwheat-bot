import { Telegraf } from 'telegraf'
import BaseHandler from './BaseHandler'
import BaseDice from '../../dice/BaseDice'
import WrongDice from '../../dice/WrongDice'

export default class DiceHandler extends BaseHandler<BaseDice, Record<string, BaseDice>> {
    private static _wrongDice = new WrongDice

    constructor() {
        super({})
    }

    setup(bot: Telegraf): void {
        bot.on('dice', async ctx => {
            const {emoji, value} = ctx.message.dice
            let action = this._instances[emoji]

            if(!action) {
                action = DiceHandler._wrongDice
            }

            await action.execute(ctx, value)
        })
    }
}