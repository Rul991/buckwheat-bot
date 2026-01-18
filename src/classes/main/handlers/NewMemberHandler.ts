import NewMemberAction from '../../actions/new-member/NewMemberAction'
import BaseHandler from './BaseHandler'
import { MyTelegraf } from '../../../utils/values/types/types'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import ArrayContainer from '../containers/ArrayContainer'

export default class NewMemberHandler extends BaseHandler<NewMemberAction, ArrayContainer<NewMemberAction>> {
    constructor() {
        super(new ArrayContainer())
    }

    setup(bot: MyTelegraf): void {
        bot.on('new_chat_members', async ctx => {
            const id = ctx.from.id
            const chatId = await LinkedChatService.getCurrent(
                ctx,
                id
            )
            if(!chatId) return

            const options = {
                ctx,
                chatId,
                id
            }

            await this._container.forEach(async action => {
                return action.execute(options)
            })
        })
    }
}