import { Telegraf } from 'telegraf'
import BaseHandler from './BaseHandler'
import Logging from '../../../utils/Logging'
import CallbackButtonAction from '../../callback-button/CallbackButtonAction'
import ContextUtils from '../../../utils/ContextUtils'
import FileUtils from '../../../utils/FileUtils'

export default class CallbackButtonActionHandler extends BaseHandler<
    CallbackButtonAction<unknown>, 
    Record<string, CallbackButtonAction<unknown>>, 
    typeof CallbackButtonAction
> {

    constructor() {
        super({}, CallbackButtonAction)
    }

    setup(bot: Telegraf): void {
        bot.action(/^([^_]+)_(.+)$/, async ctx => {
            const [_, name, rawData] = ctx.match
            Logging.log('button:', name, rawData, this._container)

            if(!name) return

            const action = this._container[name]
            if(action) {
                const data = action.getData(rawData)

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

                const text = await action.execute(ctx, data) ?? undefined
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