import { EveryMessageOptions } from '../../../utils/values/types/action-options'
import MessagesService from '../../db/services/messages/MessagesService'
import UserProfileService from '../../db/services/user/UserProfileService'
import EveryMessageAction from './EveryMessageAction'

export default class extends EveryMessageAction {
    async execute({ ctx, chatId, id }: EveryMessageOptions): Promise<void | true> {
        const firstName = ctx.from.first_name

        if (!await UserProfileService.get(chatId, id)) {
            await MessagesService.get(chatId, id)
            await UserProfileService.create(chatId, id, firstName)
        }
    }
}