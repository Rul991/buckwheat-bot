import type { MyBot } from "../../../types/bot"
import AlertUtils from "../../../utils/bot/AlertUtils"
import PayloadConverter from "../../../utils/payload/PayloadConverter"
import Logger from "../../../utils/logs/Logger"
import type CallbackQueryAction from "../../actions/base/CallbackQueryAction"
import RankedHandler from "../base/RankedHandler"

export default class CallbackQueryHandler extends RankedHandler<CallbackQueryAction<any>> {
    override add(...actions: CallbackQueryAction<any>[]): this {
        return super.add(...actions)
    }

    override async setup(bot: MyBot): Promise<void> {
        bot.on(
            'callback_query:data',
            async (ctx, next) => {
                const rawData = ctx.callbackQuery.data
                const splittedRawData = PayloadConverter.splitEncoded(rawData)
                if(!splittedRawData) {
                    return await AlertUtils.alert(
                        ctx,
                        'cb-query/wrong-data'
                    )
                }

                const [name, data] = splittedRawData
                const action = this._container.get(name)
                if(!action) {
                    return await AlertUtils.alert(
                        ctx,
                        'cb-query/no-action',
                        {
                            name
                        }
                    )
                }

                const schema = action.schema
                const decodedData = PayloadConverter.decode({
                    schema,
                    data
                })
                ctx.actionData = decodedData ?? {}
                if(!decodedData) {
                    return await AlertUtils.alert(
                        ctx,
                        'cb-query/wrong-data',
                        {
                            data: rawData
                        }
                    )
                }

                const id = ctx.vars.id
                const chatId = ctx.vars.chatId
                
                if(!id || !chatId) return
                if (!await this._checkRank({ ctx, action })) return

                Logger.system(
                    'CallbackQueryHandler',
                    {
                        decodedData,
                        name,
                        data,
                    }
                )

                const result = await action.execute({
                    ctx: ctx as any,
                    data: decodedData,
                    id,
                    chatId
                })

                const {
                    isAlert,
                    key,
                    vars
                } = result ?? {}

                await AlertUtils.show(
                    ctx,
                    key,
                    vars,
                    isAlert
                )
                return next()
            }
        )
    }
}