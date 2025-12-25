import NewMemberAction from '../../actions/new-member/NewMemberAction'
import BaseHandler from './BaseHandler'
import { MyTelegraf } from '../../../utils/values/types/types'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'

export default class NewMemberHandler extends BaseHandler<NewMemberAction, NewMemberAction[], typeof NewMemberAction> {
    constructor() {
        super([], NewMemberAction)
    }

    setup(bot: MyTelegraf): void {
        bot.on('new_chat_members', async ctx => {
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