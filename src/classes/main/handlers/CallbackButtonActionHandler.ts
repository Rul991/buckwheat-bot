import { Telegraf } from 'telegraf'
import EveryMessageAction from '../../actions/every/EveryMessageAction'
import BaseHandler from './BaseHandler'
import Logging from '../../../utils/Logging'
import BaseDice from '../../dice/BaseDice'
import WrongDice from '../../dice/WrongDice'
import CallbackButtonAction from '../../callback-button/CallbackButtonAction'

export default class CallbackButtonActionHandler extends BaseHandler<CallbackButtonAction, Record<string, CallbackButtonAction>> {
    constructor() {
        super({})
    }

    setup(bot: Telegraf): void {
        bot.action(/^([^_]+)_(.+)$/, async ctx => {
            const [_, name, data] = ctx.match
            Logging.log('button:', name, data, this._instances)

            if(!name) return

            const action = this._instances[name]
            if(!action) return

            await action.execute(ctx, data ?? '')
        })
    }
}