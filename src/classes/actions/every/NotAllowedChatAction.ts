import MessageUtils from '../../../utils/MessageUtils'
import { ALLOWED_CHATS, MODE } from '../../../utils/values/consts'
import { EveryMessageOptions } from '../../../utils/values/types/action-options'
import EveryMessageAction from './EveryMessageAction'

export default class extends EveryMessageAction {
    constructor() {
        super()
        this._canUsePrivate = true
    }

    async execute({ ctx, chatId }: EveryMessageOptions): Promise<void | true> {
        if(MODE == 'prod') return

        const isAllow = ALLOWED_CHATS.some(v => v == chatId)

        if(!isAllow) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/every-action/not-allowed-chat.pug'
            )
            return true
        }
    }
}