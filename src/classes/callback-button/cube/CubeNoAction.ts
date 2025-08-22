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
        const replyId = +data.split('_')[0]
        
        if(ctx.from.id == replyId) {
            await MessageUtils.editMarkup(ctx)
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/cubes/cancel.pug',
                {
                    changeValues: {
                        link: ContextUtils.getLinkUrl(replyId)
                    }
                }
            )
        }
        else {
            await ContextUtils.showAlert(ctx)
        }
    }
}