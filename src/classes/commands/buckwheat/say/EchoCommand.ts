import BuckwheatCommand from '../../base/BuckwheatCommand'
import MessageUtils from '../../../../utils/MessageUtils'
import Logging from '../../../../utils/Logging'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'

export default class EchoCommand extends BuckwheatCommand {
    protected _settingId: string = 'echo'

    constructor() {
        super()
        this._name = 'эхо'
        this._description = 'повторяю текст'
        this._needData = true
        this._argumentText = 'текст'
        this._isPremium = true
        this._minimumRank = 2
    }

    async execute({ ctx, other, chatId, id }: BuckwheatCommandOptions): Promise<void> {
        if(other?.length) {
            const name = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name
            Logging.log(
                `${name}(${id}) echoed "${other}"`
            )
            const isPrivate = ctx.chat.type == 'private'

            await MessageUtils.answerMessageFromResource(
                ctx, 
                'text/commands/echo/echo.pug',
                {
                    changeValues: {
                        other,
                    },
                    chatId,
                    isReply: false
                }
            )

            if(isPrivate) return
            await MessageUtils.deleteMessage(ctx)
        }
        else {
            await MessageUtils.answerMessageFromResource(
                ctx, 
                'text/commands/echo/echo-error.pug'
            )
        }
    }
}