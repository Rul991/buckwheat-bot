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

export default class UnbanCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'разбан'
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

                if(!(RankUtils.canUse(adminRank, replyRank) || isCreator) 
                    || replyId == adminId
                ) {
                    await MessageUtils.answerMessageFromResource(
                        ctx,
                        'text/commands/kick/cancel.html'
                    )
                    return
                }

                await ctx.unbanChatMember(replyId, {only_if_banned: true})

                const adminName = await UserNameService.get(adminId)
                const replyName = await UserNameService.get(replyId)

                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/kick/unban.html',
                    {
                        changeValues: {
                            replyLink: ContextUtils.getLinkUrl(replyId),
                            nameReply: replyName ?? DEFAULT_USER_NAME
                        }
                    }
                )
            }
            catch(e) {
                Logging.error(e)
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/kick/error.html',
                    {
                        changeValues: {e: e?.toString() ?? ''}
                    }
                )
            }
        }
        else {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/kick/no-reply.html'
            )
        }
    }
}