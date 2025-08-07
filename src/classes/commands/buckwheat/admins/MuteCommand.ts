import { Context } from 'telegraf'
import { MaybeString } from '../../../../utils/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import ContextUtils from '../../../../utils/ContextUtils'
import TimeUtils from '../../../../utils/TimeUtils'
import UserNameService from '../../../db/services/user/UserNameService'
import { DEFAULT_USER_NAME } from '../../../../utils/consts'
import UserRankService from '../../../db/services/user/UserRankService'
import RankUtils from '../../../../utils/RankUtils'
import { ChatPermissions } from 'telegraf/types'
import Logging from '../../../../utils/Logging'

export default class MuteCommand extends BuckwheatCommand {
    protected _filename: string

    constructor() {
        super()
        this._name = 'мут'
        this._filename = 'done'
    }

    protected _getTime(time: number): number {
        return Math.floor(time + Date.now()) / 1000
    }

    protected _getPermissions(): ChatPermissions {
        return {
            can_send_messages: false,
            can_send_other_messages: false
        }
    }

    async execute(ctx: Context, other: MaybeString): Promise<void> {
        if(ctx.message && 'reply_to_message' in ctx.message) {
            const replyMessage = ctx.message.reply_to_message!
            const replyId = replyMessage.from?.id
            
            if(!replyId) return
            
            let time: number

            if(!other) {
                time = TimeUtils.getTime('30м')
            }
            else {
                time = TimeUtils.getTime(other)
            }

            try {
                const adminId = ctx.from?.id ?? 0

                const adminRank = await UserRankService.get(adminId)
                const replyRank = await UserRankService.get(replyId)

                const isCreator = await ContextUtils.isCreator(ctx)

                if(!(RankUtils.canUse(adminRank, replyRank) || isCreator) 
                    || replyId == adminId
                    || time == -1
                ) {
                    await ContextUtils.answerMessageFromResource(
                        ctx,
                        'text/commands/mute/cancel.html'
                    )
                    return
                }
                
                await ctx.restrictChatMember(replyId, {
                    permissions: this._getPermissions(),
                    until_date: this._getTime(time)
                })

                const adminName = await UserNameService.get(adminId)
                const replyName = await UserNameService.get(replyId)

                await ContextUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/mute/done.html',
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
                    'text/commands/mute/error.html',
                    {
                        e: e?.toString() ?? ''
                    }
                )
            }
        }
        else {
            await ContextUtils.answerMessageFromResource(
                ctx,
                'text/commands/mute/no-reply.html'
            )
        }
    }
}