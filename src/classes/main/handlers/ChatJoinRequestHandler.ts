import { MyTelegraf, AsyncOrSync } from '../../../utils/values/types/types'
import ChatJoinRequestAction from '../../actions/chat-join/ChatJoinRequestAction'
import ArrayContainer from '../containers/ArrayContainer'
import BaseHandler from './BaseHandler'

export default class extends BaseHandler<ChatJoinRequestAction, ArrayContainer<ChatJoinRequestAction>> {
    constructor () {
        super(new ArrayContainer())
    }

    setup(bot: MyTelegraf): AsyncOrSync {
        bot.on('chat_join_request', async (ctx, next) => {
            const user = ctx.chatJoinRequest.from
            const id = user.id
            const chatId = ctx.chat.id

            for (const action of this._container) {
                await action.execute({
                    id,
                    ctx,
                    chatId
                })
            }

            return await next()
        })
    }
}