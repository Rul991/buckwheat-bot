import { Telegraf } from 'telegraf'
import EveryMessageAction from '../../actions/every/EveryMessageAction'
import BaseHandler from './BaseHandler'
import Logging from '../../../utils/Logging'

export default class EveryMessageHandler extends BaseHandler<EveryMessageAction, EveryMessageAction[]> {
    constructor() {
        super([])
    }

    setup(bot: Telegraf): void {
        bot.on('message', async (ctx, next) => {
            Logging.log(ctx.message)

            const isPrivate = ctx.chat.type == 'private'

            for (const action of this._instances) {
                if(isPrivate && !action.canUsePrivate) continue
                if(await action.execute(ctx)) return
            }

            next()
        })
    }
}