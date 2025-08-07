import { Context } from 'telegraf'
import { MaybeString } from '../../../../utils/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import ContextUtils from '../../../../utils/ContextUtils'
import UserNameService from '../../../db/services/user/UserNameService'
import { DEFAULT_USER_NAME } from '../../../../utils/consts'
import UserRankService from '../../../db/services/user/UserRankService'
import RankUtils from '../../../../utils/RankUtils'
import TimeUtils from '../../../../utils/TimeUtils'
import Logging from '../../../../utils/Logging'

export default class KickCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'бан'
    }

    protected _getUntilDate(time: string): number {
        return TimeUtils.getTime(time)
    }

    async execute(ctx: Context, other: MaybeString): Promise<void> {
        if(ctx.message && 'reply_to_message' in ctx.message) {
            const replyMessage = ctx.message.reply_to_message!
            const replyId = replyMessage.from?.id
            
            if(!replyId) return

            try {
                const adminId = ctx.from?.id ?? 0

                const adminRank = await UserRankService.get(adminId)
                const replyRank = await UserRankService.get(replyId)

                const isCreator = await ContextUtils.isCreator(ctx)
                const time = this._getUntilDate(other ?? 'навсегда')

                if(!(RankUtils.canUse(adminRank, replyRank) || isCreator) 
                    || replyId == adminId
                ) {
                    await ContextUtils.answerMessageFromResource(
                        ctx,
                        'text/commands/kick/cancel.html'
                    )
                    return
                }

                await ctx.banChatMember(replyId,  (time + Date.now()) / 1000)

                const adminName = await UserNameService.get(adminId)
                const replyName = await UserNameService.get(replyId)

                await ContextUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/kick/done.html',
                    {
                        replyLink: ContextUtils.getLinkUrl(replyId),
                        adminLink: ContextUtils.getLinkUrl(adminId),
                        admName: adminName ?? DEFAULT_USER_NAME,
                        nameReply: replyName ?? DEFAULT_USER_NAME,
                        time: TimeUtils.getTimeName(time)
                    }
                )
            }
            catch(e) {
                Logging.error(e)
                await ContextUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/kick/error.html',
                    {
                        e: e?.toString() ?? ''
                    }
                )
            }
        }
        else {
            await ContextUtils.answerMessageFromResource(
                ctx,
                'text/commands/kick/no-reply.html'
            )
        }
    }
}