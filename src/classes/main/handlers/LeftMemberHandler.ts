import BaseHandler from './BaseHandler'
import LeftMemberAction from '../../actions/left-member/LeftMemberAction'
import { MyTelegraf } from '../../../utils/values/types/types'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'

export default class LeftMemberHandler extends BaseHandler<LeftMemberAction, LeftMemberAction[], typeof LeftMemberAction> {
    constructor () {
        super([], LeftMemberAction)
    }

    setup(bot: MyTelegraf): void {
        bot.on('left_chat_member', async ctx => {
            const id = ctx.from.id
            const chatId = await LinkedChatService.getCurrent(
                ctx,
                id
            )
            if(!chatId) return
            for (const action of this._container) {
                await action.execute({
                    ctx,
                    chatId,
                    id
                })
            }
        })
    }
}