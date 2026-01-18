import BaseHandler from './BaseHandler'
import BaseDice from '../../dice/BaseDice'
import WrongDice from '../../dice/WrongDice'
import { MyTelegraf } from '../../../utils/values/types/types'
import MapContainer from '../containers/MapContainer'

export default class DiceHandler extends BaseHandler<BaseDice, MapContainer<BaseDice>> {
    private static _wrongDice = new WrongDice

    constructor () {
        super(new MapContainer())
    }

    setup(bot: MyTelegraf): void {
        bot.on('dice', async ctx => {
            const { emoji, value } = ctx.message.dice
            const action = this._container.getByKey(emoji) ??
                DiceHandler._wrongDice

            await action.execute({
                ctx,
                value
            })
        })
    }
}