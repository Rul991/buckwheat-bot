import { TextContext } from '../../../../utils/values/types/contexts'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import RankUtils from '../../../../utils/RankUtils'
import TimeUtils from '../../../../utils/TimeUtils'
import UserRankService from '../../../db/services/user/UserRankService'
import StringUtils from '../../../../utils/StringUtils'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import { NOT_FOUND_INDEX } from '../../../../utils/values/consts'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'

export default abstract class AdminCommand extends BuckwheatCommand {
    protected _folder: string
    protected _isUndoCommand: boolean
    protected _onUser: boolean
    protected _minimumRank: number

    constructor() {
        super()
        this._folder = 'admin'
        this._isUndoCommand = true
        this._minimumRank = RankUtils.admin
        this._onUser = true
    }

    protected abstract _do(ctx: TextContext, replyId: number, time: number, chatId: number): Promise<boolean>

    async execute({ ctx, other, chatId, replyFrom }: BuckwheatCommandOptions): Promise<void> {
        const changeValues = {
            isUndo: this._isUndoCommand
        }

        if(replyFrom) {
            const replyId = replyFrom.id
            const adminId = ctx.from.id
            
            const adminRank = await UserRankService.get(chatId, adminId)
            const replyRank = await UserRankService.get(chatId, replyId)

            const isCreator = await ContextUtils.isCreator(ctx)
            const [textTime, rawReason] = other ? StringUtils.splitByCommands(other, 1) : ['навсегда', '']
            const time = Math.min(
                TimeUtils.parseTimeToMilliseconds(textTime),
                await TimeUtils.getMaxAdminTime(chatId)
            )
            const reason = time == NOT_FOUND_INDEX ? `${textTime} ${rawReason ?? ''}` : rawReason

            if(!RankUtils.canAdminUse({
                userRank: adminRank, 
                replyRank, 
                adminRank: this._minimumRank,
                isCreator,
                id: adminId
            })) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    `text/commands/admin/rank-issue.pug`
                )
                return
            }

            if(replyId == adminId) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    `text/commands/${this._folder}/cancel.pug`,
                    {
                        changeValues
                    }
                )
                return
            }

            const isDone = await this._do(
                ctx, 
                replyId, 
                time,
                chatId
            )

            if(!isDone) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    `text/commands/${this._folder}/error.pug`,
                    {
                        changeValues
                    }
                )
                return
            }

            const admin = await ContextUtils.getUser(chatId, adminId)
            const reply = await ContextUtils.getUser(chatId, replyId)

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
                `text/commands/${this._folder}/no-reply.pug`,
                {
                    changeValues
                }
            )
        }
    }
}