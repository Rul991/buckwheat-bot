import { Context } from 'telegraf'
import EveryMessageAction from './EveryMessageAction'

export default class AddMessagesAction extends EveryMessageAction {
    async execute(ctx: Context): Promise<void> {
        if(!ctx.from) return
        if(!ctx.chat) return

        const {id, first_name} = ctx.from
        const chatId = ctx.chat.id
    }
}