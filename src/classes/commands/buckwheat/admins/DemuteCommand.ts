import { Context } from 'telegraf'
import { MaybeString } from '../../../../utils/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import ContextUtils from '../../../../utils/ContextUtils'
import UserNameService from '../../../db/services/user/UserNameService'
import { DEFAULT_USER_NAME } from '../../../../utils/consts'
import UserRankService from '../../../db/services/user/UserRankService'
import RankUtils from '../../../../utils/RankUtils'

export default class DemuteCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'размут'
    }

    async execute(ctx: Context, _: MaybeString): Promise<void> {
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
                    await ContextUtils.answerMessageFromResource(
                        ctx,
                        'text/commands/mute/cancel.html'
                    )
                    return
                }

                await ctx.restrictChatMember(replyId, {
                    permissions: {
                        can_send_messages: true,
                        can_send_other_messages: true,
                        can_invite_users: true,
                        can_send_polls: true,
                        can_add_web_page_previews: true
                    },
                    until_date: 0
                })

                const adminName = await UserNameService.get(adminId)
                const replyName = await UserNameService.get(replyId)

                await ContextUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/mute/demute.html',
                    {
                        replyLink: ContextUtils.getLinkUrl(replyId),
                        adminLink: ContextUtils.getLinkUrl(adminId),
                        admName: adminName ?? DEFAULT_USER_NAME,
                        nameReply: replyName ?? DEFAULT_USER_NAME
                    }
                )
            }
            catch(e) {
                console.error(e)
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