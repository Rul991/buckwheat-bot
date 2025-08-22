import { Context } from 'telegraf'
import { MaybeString, TextContext } from '../../../../utils/values/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import AdminUtils from '../../../../utils/AdminUtils'
import { DEFAULT_USER_NAME } from '../../../../utils/values/consts'
import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import RankUtils from '../../../../utils/RankUtils'
import TimeUtils from '../../../../utils/TimeUtils'
import UserNameService from '../../../db/services/user/UserNameService'
import UserRankService from '../../../db/services/user/UserRankService'
import StringUtils from '../../../../utils/StringUtils'

export default abstract class AdminCommand extends BuckwheatCommand {
    protected _folder: string
    protected _isUndoCommand: boolean
    protected _minimumRank: number

    constructor() {
        super()
        this._folder = 'admin'
        this._isUndoCommand = true
        this._minimumRank = RankUtils.admin
    }

    protected abstract _do(ctx: TextContext, replyId: number, time: number): Promise<boolean>

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        if(ctx.message.reply_to_message && ctx.message.reply_to_message.from) {
            const replyId = ctx.message.reply_to_message.from.id
            const adminId = ctx.from.id

            const adminRank = await UserRankService.get(adminId)
            const replyRank = await UserRankService.get(replyId)

            const isCreator = await ContextUtils.isCreator(ctx)
            const [textTime, reason] = other ? StringUtils.splitByCommands(other, 1) : ['навсегда', '']
            const time = TimeUtils.parseTimeToMilliseconds(textTime)

            if(!(RankUtils.canUse(adminRank, replyRank, this._minimumRank) || isCreator) 
                || replyId == adminId
            ) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    `text/commands/${this._folder}/cancel.pug`
                )
                return
            }

            const isDone = await this._do(ctx, replyId, time)

            if(!isDone) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    `text/commands/${this._folder}/error.pug`
                )
                return
            }

            const admin = await ContextUtils.getUser(adminId)
            const reply = await ContextUtils.getUser(replyId)

            await MessageUtils.answerMessageFromResource(
                ctx,
                `text/commands/${this._folder}/${this._isUndoCommand ? 'undo' : 'done'}.pug`,
                {
                    changeValues: {
                        replyLink: reply.link,
                        adminLink: admin.link,
                        admName: admin.name,
                        nameReply: reply.name,
                        time: TimeUtils.formatMillisecondsToTime(time),
                        reason: reason ? `Причина: ${reason}` : ''
                    }
                }
            )
        
        }
        else {
            await MessageUtils.answerMessageFromResource(
                ctx,
                `text/commands/${this._folder}/no-reply.pug`
            )
        }
    }
}