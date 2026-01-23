import BuckwheatCommand from '../../base/BuckwheatCommand'
import MessageUtils from '../../../../utils/MessageUtils'
import UserRankService from '../../../db/services/user/UserRankService'
import RankUtils from '../../../../utils/RankUtils'
import Logging from '../../../../utils/Logging'
import ContextUtils from '../../../../utils/ContextUtils'
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
        const rank = await UserRankService.get(chatId, id)
        const chatMember = await ctx.telegram.getChatMember(chatId, id)

        if(chatMember.status == 'restricted' || chatMember.status == 'kicked' || chatMember.status == 'left') {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/echo/status-issue.pug'
            )
            return
        }

        if(typeof other == 'string' && other.length) {
            Logging.log(
                `${ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name}(${id}) echoed "${other}"`
            )
            const isPrivate = ctx.chat.type == 'private'

            await MessageUtils.answerMessageFromResource(
                ctx, 
                'text/commands/echo/echo.pug',
                {
                    changeValues: {
                        other,
                        user: rank >= RankUtils.admin ? {} : await ContextUtils.getUserFromContext(ctx)
                    },
                    chatId,
                    isReply: false
                }
            )

            if(isPrivate) return
            await MessageUtils.deleteMessage(ctx)
        }
        else {
            await MessageUtils.answerMessageFromResource(ctx, 'text/commands/echo/echoError.pug')
        }
    }
}