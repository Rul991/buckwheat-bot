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
import MessageUtils from '../../../../utils/MessageUtils'
import AdminUtils from '../../../../utils/AdminUtils'

export default class BanCommand extends BuckwheatCommand {
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

            const adminId = ctx.from?.id ?? 0

            const adminRank = await UserRankService.get(adminId)
            const replyRank = await UserRankService.get(replyId)

            const isCreator = await ContextUtils.isCreator(ctx)
            const time = this._getUntilDate(other ?? 'навсегда')

            if(!(RankUtils.canUse(adminRank, replyRank) || isCreator) 
                || replyId == adminId
            ) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/kick/cancel.html'
                )
                return
            }

            if(!await AdminUtils.ban(ctx, replyId, time)) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/kick/error.html'
                )
                return
            }

            const adminName = await UserNameService.get(adminId)
            const replyName = await UserNameService.get(replyId)

            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/kick/done.html',
                {
                    changeValues: {
                        replyLink: ContextUtils.getLinkUrl(replyId),
                        adminLink: ContextUtils.getLinkUrl(adminId),
                        admName: adminName ?? DEFAULT_USER_NAME,
                        nameReply: replyName ?? DEFAULT_USER_NAME,
                        time: TimeUtils.getTimeName(time)
                    }
                }
            )
        
        }
        else {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/kick/no-reply.html'
            )
        }
    }
}