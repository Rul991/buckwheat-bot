import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import { CallbackButtonContext } from '../../../utils/values/types'
import CallbackButtonAction from '../CallbackButtonAction'

export default class CubeNoAction extends CallbackButtonAction {
    constructor() {
        super()
        this._name = 'cubeno'
    }

    async execute(ctx: CallbackButtonContext, data: string): Promise<void> {
        const [replyId, userId] = data.split('_').map(v => +v)
        const changeValues = await ContextUtils.getUserFromContext(ctx)
        
        if(ctx.from.id == replyId) {
            await MessageUtils.editMarkup(ctx)
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/cubes/cancel.pug',
                {
                    changeValues
                }
            )
        }
        else if(ctx.from.id == userId) {
            await MessageUtils.editMarkup(ctx)
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/cubes/creator-cancel.pug',
                {
                    changeValues
                }
            )
        }
        else {
            await ContextUtils.showCallbackMessageFromFile(ctx)
        }
    }
}