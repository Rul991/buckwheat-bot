import { Context } from 'telegraf'
import { MaybeString, TextContext } from '../../../utils/values/types'
import BuckwheatCommand from '../base/BuckwheatCommand'
import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import UserLinkedService from '../../db/services/user/UserLinkedService'
import UserRankService from '../../db/services/user/UserRankService'
import RankUtils from '../../../utils/RankUtils'
import Logging from '../../../utils/Logging'

export default class EchoCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'эхо'
        this._description = 'повторяю текст'
        this._needData = true
        this._argumentText = 'текст'
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        const rank = await UserRankService.get(ctx.from.id)

        if(rank < RankUtils.min + 2) {
            await MessageUtils.answerMessageFromResource(ctx, 'text/commands/echo/rank-issue.pug')
            return
        }

        if(typeof other == 'string' && other.length) {
            Logging.log(`${ctx.from.first_name}(${ctx.from.id}) echoed "${other}"`)
            const isPrivate = ctx.chat.type == 'private'
            const chatId = isPrivate ? 
                await UserLinkedService.get(ctx.from.id) || ctx.chat.id :
                ctx.chat.id

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