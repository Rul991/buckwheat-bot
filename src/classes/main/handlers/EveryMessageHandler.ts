import { Telegraf } from 'telegraf'
import EveryMessageAction from '../../actions/every/EveryMessageAction'
import BaseHandler from './BaseHandler'
import Logging from '../../../utils/Logging'
import { MyTelegraf } from '../../../utils/values/types/types'

export default class EveryMessageHandler extends BaseHandler<EveryMessageAction, EveryMessageAction[], typeof EveryMessageAction> {
    constructor() {
        super([], EveryMessageAction)
    }

    setup(bot: MyTelegraf): void {
        bot.on('message', async (ctx, next) => {
            Logging.log(ctx.message)

            const isPrivate = ctx.chat.type == 'private'

            for (const action of this._container) {
                if(isPrivate && !action.canUsePrivate) continue
                if(await action.execute(ctx)) return
            }

            next()
        })
    }
}