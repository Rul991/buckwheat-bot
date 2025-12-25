import BaseHandler from './BaseHandler'
import BaseDice from '../../dice/BaseDice'
import WrongDice from '../../dice/WrongDice'
import { MyTelegraf } from '../../../utils/values/types/types'

export default class DiceHandler extends BaseHandler<BaseDice, Record<string, BaseDice>, typeof BaseDice> {
    private static _wrongDice = new WrongDice

    constructor () {
        super({}, BaseDice)
    }

    setup(bot: MyTelegraf): void {
        bot.on('dice', async ctx => {
            const { emoji, value } = ctx.message.dice
            let action = this._container[emoji]

            if (!action) {
                action = DiceHandler._wrongDice
            }

            await action.execute({
                ctx,
                value
            })
        })
    }
}