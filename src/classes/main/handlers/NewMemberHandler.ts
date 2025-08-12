import { Telegraf } from 'telegraf'
import NewMemberAction from '../../actions/new-member/NewMemberAction'
import BaseHandler from './BaseHandler'

export default class NewMemberHandler extends BaseHandler<NewMemberAction, NewMemberAction[]> {
    constructor() {
        super([])
    }

    setup(bot: Telegraf): void {
        bot.on('new_chat_members', async ctx => {
            for (const action of this._instances) {
                await action.execute(ctx)
            }
        })
    }
}