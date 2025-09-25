import { Telegraf } from 'telegraf'
import BaseHandler from './BaseHandler'
import Logging from '../../../utils/Logging'
import CallbackButtonAction from '../../callback-button/CallbackButtonAction'

export default class CallbackButtonActionHandler extends BaseHandler<CallbackButtonAction, Record<string, CallbackButtonAction>, typeof CallbackButtonAction> {
    constructor() {
        super({}, CallbackButtonAction)
    }

    setup(bot: Telegraf): void {
        bot.action(/^([^_]+)_(.+)$/, async ctx => {
            const [_, name, data] = ctx.match
            Logging.log('button:', name, data, this._container)

            if(!name) return

            const action = this._container[name]

            const text = action ? 
                await action.execute(ctx, data ?? '') ?? undefined :
                'Кнопка не работает!'
            await ctx.answerCbQuery(text, !action ? {show_alert: true} : undefined)
        })
    }
}