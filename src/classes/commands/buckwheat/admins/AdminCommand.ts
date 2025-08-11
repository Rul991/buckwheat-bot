import { Context } from 'telegraf'
import { MaybeString, TextContext } from '../../../../utils/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import AdminUtils from '../../../../utils/AdminUtils'
import { DEFAULT_USER_NAME } from '../../../../utils/consts'
import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import RankUtils from '../../../../utils/RankUtils'
import TimeUtils from '../../../../utils/TimeUtils'
import UserNameService from '../../../db/services/user/UserNameService'
import UserRankService from '../../../db/services/user/UserRankService'

export default abstract class AdminCommand extends BuckwheatCommand {
    protected _folder: string
    protected _isUndoCommand: boolean
    protected _minimumRank: number

    constructor() {
        super()
        this._folder = 'admin'
        this._isUndoCommand = true
        this._minimumRank = RankUtils.adminRank
    }

    protected abstract _do(ctx: TextContext, replyId: number, time: number): Promise<boolean>

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        if(ctx.message && 'reply_to_message' in ctx.message) {
            const replyMessage = ctx.message.reply_to_message!
            const replyId = replyMessage.from?.id
            
            if(!replyId) return

            const adminId = ctx.from?.id ?? 0

            const adminRank = await UserRankService.get(adminId)
            const replyRank = await UserRankService.get(replyId)

            const isCreator = await ContextUtils.isCreator(ctx)
            const time = TimeUtils.parseTimeToMilliseconds(other ?? 'навсегда')

            if(!(RankUtils.canUse(adminRank, replyRank, this._minimumRank) || isCreator) 
                || replyId == adminId
            ) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    `text/commands/${this._folder}/cancel.html`
                )
                return
            }

            const isDone = await this._do(ctx, replyId, time)

            if(!isDone) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    `text/commands/${this._folder}/error.html`
                )
                return
            }

            const adminName = await UserNameService.get(adminId)
            const replyName = await UserNameService.get(replyId)

            await MessageUtils.answerMessageFromResource(
                ctx,
                `text/commands/${this._folder}/${this._isUndoCommand ? 'undo' : 'done'}.html`,
                {
                    changeValues: {
                        replyLink: ContextUtils.getLinkUrl(replyId),
                        adminLink: ContextUtils.getLinkUrl(adminId),
                        admName: adminName ?? DEFAULT_USER_NAME,
                        nameReply: replyName ?? DEFAULT_USER_NAME,
                        time: TimeUtils.formatMillisecondsToTime(time)
                    }
                }
            )
        
        }
        else {
            await MessageUtils.answerMessageFromResource(
                ctx,
                `text/commands/${this._folder}/no-reply.html`
            )
        }
    }
}