import { Context } from 'telegraf'
import EveryMessageAction from './EveryMessageAction'
import { CHAT_ID } from '../../../utils/consts'

export default class WrongChatAction extends EveryMessageAction {
    async execute(ctx: Context): Promise<void | true> {
        if(ctx.chat?.id !== +CHAT_ID) {
            return true
        }
    }
}