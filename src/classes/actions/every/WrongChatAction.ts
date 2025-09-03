import EveryMessageAction from './EveryMessageAction'
import { MessageContext } from '../../../utils/values/types'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import MessageUtils from '../../../utils/MessageUtils'

export default class WrongChatAction extends EveryMessageAction {
    constructor() {
        super()
        this._canUsePrivate = true
    }

    async execute(ctx: MessageContext): Promise<void | true> {
        if(ctx.chat.type == 'private') {
            const linkedChat = await LinkedChatService.get(ctx.from.id)
            const hasntLinkedChat = !linkedChat

            if(hasntLinkedChat) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/every-action/wrong-chat.pug'
                )
                return true
            }
        }
    }
}