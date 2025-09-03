import { MaybeString, TextContext } from '../../../utils/values/types'
import BuckwheatCommand from '../base/BuckwheatCommand'
import MessageUtils from '../../../utils/MessageUtils'
import UserRankService from '../../db/services/user/UserRankService'
import RankUtils from '../../../utils/RankUtils'
import Logging from '../../../utils/Logging'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'

export default class EchoCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'эхо'
        this._description = 'повторяю текст'
        this._needData = true
        this._argumentText = 'текст'
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        const chatId = await LinkedChatService.getChatId(ctx)
        if(!chatId) return
        
        const rank = await UserRankService.get(chatId, ctx.from.id)

        if(rank < RankUtils.min + 2) {
            await MessageUtils.answerMessageFromResource(ctx, 'text/commands/echo/rank-issue.pug')
            return
        }

        if(typeof other == 'string' && other.length) {
            Logging.log(
                `${ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name}(${ctx.from.id}) echoed "${other}"`
            )
            const isPrivate = ctx.chat.type == 'private'

            if(!chatId) return

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
            await ctx.deleteMessage()
        }
        else {
            await MessageUtils.answerMessageFromResource(ctx, 'text/commands/echo/echoError.pug')
        }
    }
}