import EveryMessageAction from '../../actions/every/EveryMessageAction'
import BaseHandler from './BaseHandler'
import Logging from '../../../utils/Logging'
import { MyTelegraf } from '../../../utils/values/types/types'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'

export default class EveryMessageHandler extends BaseHandler<EveryMessageAction, EveryMessageAction[], typeof EveryMessageAction> {
    constructor() {
        super([], EveryMessageAction)
    }

    setup(bot: MyTelegraf): void {
        bot.on('message', async (ctx, next) => {
            Logging.log(ctx.message)

            const isPrivate = ctx.chat.type == 'private'
            const id = ctx.from.id
            const chatId = await LinkedChatService.getCurrent(
                ctx,
                id
            )
            if(!chatId) return next()

            for (const action of this._container) {
                if(isPrivate && !action.canUsePrivate) continue
                if(
                    await action.execute({
                        ctx,
                        chatId,
                        id
                    })
                ) return
            }

            next()
        })
    }
}