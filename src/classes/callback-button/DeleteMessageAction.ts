import MessageUtils from '../../utils/MessageUtils'
import { CallbackButtonContext } from '../../utils/values/types'
import CallbackButtonAction from './CallbackButtonAction'

export default class DeleteMessageAction extends CallbackButtonAction {
    constructor() {
        super()
        this._name = 'deletemessage'
    }

    async execute(ctx: CallbackButtonContext, data: string): Promise<string | void> {
        let isCanDelete = true
        const [rawSecure, rawUserId] = data.split('_')
        const isSecure = Boolean(+rawSecure)
        
        if(isSecure) {
            const userId = +rawUserId
            const id = ctx.from.id

            isCanDelete = id == userId
        }

        if(isCanDelete) {
            await MessageUtils.deleteMessage(ctx)
        }
    }
}