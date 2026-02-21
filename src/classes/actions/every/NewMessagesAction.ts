import { EveryMessageOptions } from '../../../utils/values/types/action-options'
import MessagesService from '../../db/services/messages/MessagesService'
import EveryMessageAction from './EveryMessageAction'

export default class NewMessagesAction extends EveryMessageAction {
    async execute({ ctx }: EveryMessageOptions): Promise<void | true> {
        await MessagesService.add(ctx.chat.id, ctx.from.id)
    }
}