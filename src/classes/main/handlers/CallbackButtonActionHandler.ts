import BaseHandler from './BaseHandler'
import Logging from '../../../utils/Logging'
import CallbackButtonAction from '../../callback-button/CallbackButtonAction'
import ContextUtils from '../../../utils/ContextUtils'
import FileUtils from '../../../utils/FileUtils'
import { MyTelegraf } from '../../../utils/values/types/types'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'

export default class CallbackButtonActionHandler extends BaseHandler<
    CallbackButtonAction<unknown>, 
    Record<string, CallbackButtonAction<unknown>>, 
    typeof CallbackButtonAction
> {

    constructor() {
        super({}, CallbackButtonAction)
    }

    private async _executeAction(action: CallbackButtonAction<any>, options: CallbackButtonOptions<any>) {
        return await action.execute(options) ?? undefined
    }

    setup(bot: MyTelegraf): void {
        bot.action(/^([^_]+)_(.+)$/, async ctx => {
            const [_, name, rawData] = ctx.match
            Logging.log('button:', name, rawData, ctx.from.id)

            if(!name) return

            const action = this._container[name]
            if(action) {
                const numberiziedData = rawData//NumberByteConverter.replaceBytesToNumber(rawData)
                const data = action.getData(numberiziedData)

                if(action.schema && !action.isValid(data)) {
                    await ContextUtils.showCallbackMessage(
                        ctx, 
                        await FileUtils.readPugFromResource(
                            'text/actions/callback-button/wrong-json.pug'
                        ),
                        true
                    )
                    return
                }

                const id = ctx.from.id
                const chatId = await LinkedChatService.getCurrent(ctx, id)
                if(!chatId) return

                const text = chatId ? await this._executeAction(action, {
                    ctx, 
                    data,
                    id,
                    chatId
                }) : await FileUtils.readPugFromResource('text/actions/other/no-chat-id.pug')
                await ctx.answerCbQuery(text)
            }
            else {
                await ContextUtils.showCallbackMessage(
                    ctx, 
                    await FileUtils.readPugFromResource(
                        'text/actions/callback-button/not-exist.pug'
                    ),
                    true
                )
            }

        })
    }
}