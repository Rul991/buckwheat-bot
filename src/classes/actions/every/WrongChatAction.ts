import EveryMessageAction from './EveryMessageAction'
import { CHAT_ID } from '../../../utils/values/consts'
import { MessageContext } from '../../../utils/values/types'
import UserLinkedService from '../../db/services/user/UserLinkedService'

export default class WrongChatAction extends EveryMessageAction {
    constructor() {
        super()
        this._canUsePrivate = true
    }

    async execute(ctx: MessageContext): Promise<void | true> {
        if(ctx.chat.id !== CHAT_ID) {
            if(ctx.chat.type != 'private') return true

            const linkedChat = await UserLinkedService.get(ctx.from.id)
            const hasLinkedChat = !!linkedChat

            if(!hasLinkedChat) return true
        }
    }
}