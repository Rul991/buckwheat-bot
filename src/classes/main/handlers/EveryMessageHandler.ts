import EveryMessageAction from '../../actions/every/EveryMessageAction'
import BaseHandler from './BaseHandler'
import Logging from '../../../utils/Logging'
import { MyTelegraf } from '../../../utils/values/types/types'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import ArrayContainer from '../containers/ArrayContainer'

export default class EveryMessageHandler extends BaseHandler<EveryMessageAction, ArrayContainer<EveryMessageAction>> {
    constructor () {
        super(new ArrayContainer())
    }

    setup(bot: MyTelegraf): void {
        bot.on('message', async (ctx, next) => {
            Logging.system(ctx.message)

            const isPrivate = ctx.chat.type == 'private'
            const id = ctx.from.id
            const chatId = await LinkedChatService.getCurrent(
                ctx,
                id
            )
            if (!chatId) return next()

            const options = {
                ctx,
                chatId,
                id
            }

            for (const action of this._container) {
                if (isPrivate && !action.canUsePrivate) continue
                if(await action.execute(options)) {
                    return
                }
            }

            return next()
        })
    }
}