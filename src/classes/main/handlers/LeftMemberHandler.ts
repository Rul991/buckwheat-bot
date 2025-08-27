import { Telegraf } from 'telegraf'
import BaseHandler from './BaseHandler'
import LeftMemberAction from '../../actions/left-member/LeftMemberAction'

export default class LeftMemberHandler extends BaseHandler<LeftMemberAction, LeftMemberAction[]> {
    constructor() {
        super([])
    }

    setup(bot: Telegraf): void {
        bot.on('left_chat_member', async ctx => {
            for (const action of this._instances) {
                await action.execute(ctx)
            }
        })
    }
}