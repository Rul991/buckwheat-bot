import { Telegraf } from 'telegraf'
import NewMemberAction from '../../actions/new-member/NewMemberAction'
import BaseHandler from './BaseHandler'

export default class NewMemberHandler extends BaseHandler<NewMemberAction, NewMemberAction[], typeof NewMemberAction> {
    constructor() {
        super([], NewMemberAction)
    }

    setup(bot: Telegraf): void {
        bot.on('new_chat_members', async ctx => {
            for (const action of this._container) {
                await action.execute(ctx)
            }
        })
    }
}