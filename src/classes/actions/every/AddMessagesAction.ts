import { Context } from 'telegraf'
import EveryMessageAction from './EveryMessageAction'
import { MessageContext } from '../../../utils/types'

export default class AddMessagesAction extends EveryMessageAction {
    async execute(ctx: MessageContext): Promise<void> {
        if(!ctx.from) return

        const {id, first_name} = ctx.from
    }
}