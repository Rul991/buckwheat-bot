import MessageUtils from '../../../utils/MessageUtils'
import { ALLOWED_CHATS, MODE } from '../../../utils/values/consts'
import { MessageContext } from '../../../utils/values/types/types'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import EveryMessageAction from './EveryMessageAction'

export default class extends EveryMessageAction {
    constructor() {
        super()
        this._canUsePrivate = true
    }

    async execute(ctx: MessageContext): Promise<void | true> {
        if(MODE == 'prod') return

        const id = ctx.from.id
        const chatId = await LinkedChatService.getCurrent(
            ctx,
            id
        )
        const isDeny = !(chatId && ALLOWED_CHATS.some(v => v == chatId))

        if(isDeny) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/every-action/not-allowed-chat.pug'
            )
            return true
        }
    }
}