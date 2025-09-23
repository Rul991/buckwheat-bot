import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import { CallbackButtonContext } from '../../../utils/values/types'
import CubePlayingService from '../../db/services/cube/CubePlayingService'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import CallbackButtonAction from '../CallbackButtonAction'

export default class CubeNoAction extends CallbackButtonAction {
    constructor() {
        super()
        this._name = 'cubeno'
    }

    async execute(ctx: CallbackButtonContext, data: string): Promise<void> {
        const [replyId, userId] = data.split('_').map(v => +v)
        
        const chatId = await LinkedChatService.getCurrent(ctx, replyId)
        if(!chatId) return
        const changeValues = await ContextUtils.getUserFromContext(ctx)

        const doCallback = async (filename: string) => {
            await CubePlayingService.set(chatId, userId, false)
            await MessageUtils.editMarkup(ctx)
            await MessageUtils.answerMessageFromResource(
                ctx,
                `text/commands/cubes/${filename}.pug`,
                {
                    changeValues,
                }
            )
        }
        
        if(ctx.from.id == replyId) {
            await doCallback('cancel')
        }
        else if(ctx.from.id == userId) {
            await doCallback('creator-cancel')
        }
        else {
            await ContextUtils.showCallbackMessageFromFile(ctx)
        }
    }
}