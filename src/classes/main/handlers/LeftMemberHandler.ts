import BaseHandler from './BaseHandler'
import LeftMemberAction from '../../actions/left-member/LeftMemberAction'
import { MyTelegraf } from '../../../utils/values/types/types'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import ArrayContainer from '../containers/ArrayContainer'

export default class LeftMemberHandler extends BaseHandler<LeftMemberAction, ArrayContainer<LeftMemberAction>> {
    constructor () {
        super(new ArrayContainer())
    }

    setup(bot: MyTelegraf): void {
        bot.on('left_chat_member', async ctx => {
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

            this._container.forEach(async action => {
                await action.execute({
                    ctx,
                    chatId,
                    id
                })
            })
        })
    }
}