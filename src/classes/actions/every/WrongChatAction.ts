import EveryMessageAction from './EveryMessageAction'
import { MessageContext } from '../../../utils/values/types/contexts'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import MessageUtils from '../../../utils/MessageUtils'
import { EveryMessageOptions } from '../../../utils/values/types/action-options'

export default class WrongChatAction extends EveryMessageAction {
    constructor() {
        super()
        this._canUsePrivate = true
    }

    async execute({ ctx }: EveryMessageOptions): Promise<void | true> {
        if(ctx.chat.type == 'private') {
            const linkedChat = await LinkedChatService.getRaw(ctx.from.id)
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