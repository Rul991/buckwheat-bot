import CommandUtils from '../../../../utils/CommandUtils'
import { ConditionalCommandOptions } from '../../../../utils/values/types/action-options'
import { MyTelegraf } from '../../../../utils/values/types/types'
import ConditionalCommand from '../../../commands/base/ConditionalCommand'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import ArrayContainer from '../../containers/ArrayContainer'
import BaseHandler from '../BaseHandler'

export default class extends BaseHandler<ConditionalCommand, ArrayContainer<ConditionalCommand>> {
    constructor () {
        super(new ArrayContainer())
    }

    async setup(bot: MyTelegraf): Promise<void> {
        bot.on('message', async (ctx, next) => {
            const text = ctx.text ?? ''

            const isCommand = await CommandUtils.doIfCommand(
                text,
                async strings => {
                    const id = ctx.from.id
                    const chatId = await LinkedChatService.getCurrent(ctx, id)
                    if (!chatId) return next()

                    const options: ConditionalCommandOptions = {
                        chatId,
                        id,
                        strings,
                        ctx
                    }

                    for (const action of this._container) {
                        if(await action.execute(options)) {
                            return
                        }
                    }

                    return next()
                }
            )

            if(!isCommand) {
                return next()
            }
        })
    }
}