import { MyTelegraf } from '../../../utils/values/types/types'
import MyChatMemberAction from '../../actions/my-chat-member/MyChatMemberAction'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import ArrayContainer from '../containers/ArrayContainer'
import BaseHandler from './BaseHandler'

export default class extends BaseHandler<
    MyChatMemberAction,
    ArrayContainer<MyChatMemberAction>
> {
    constructor () {
        super(new ArrayContainer())
    }

    async setup(bot: MyTelegraf): Promise<void> {
        bot.on('my_chat_member', async ctx => {
            const id = ctx.from.id
            const chatId = await LinkedChatService.getCurrent(ctx, id)
            if(!chatId) return

            const {
                myChatMember: {
                    old_chat_member: {
                        status: oldStatus
                    },
                    new_chat_member: {
                        status: newStatus
                    },
                }
            } = ctx

            for (const action of this._container) {
                await action.execute({
                    ctx,
                    oldStatus,
                    newStatus,
                    chatId,
                    id
                })
            }
        })
    }
}