import { MessageContext } from '../../../utils/values/types'
import MessagesService from '../../db/services/messages/MessagesService'
import EveryMessageAction from './EveryMessageAction'

export default class NewMessagesAction extends EveryMessageAction {
    async execute(ctx: MessageContext): Promise<void | true> {
        await MessagesService.add(ctx.from.id)
    }
}