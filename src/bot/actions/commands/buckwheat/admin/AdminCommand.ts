import { MAX_USER_TEXT_LENGTH } from "../../../../../consts/lengths"
import UserService from "../../../../../db/services/user/UserService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { AdminExecuteOptions } from "../../../../../types/options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import StringUtils from "../../../../../utils/string/StringUtils"
import TimeUtils from "../../../../../utils/time/TimeUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default abstract class AdminCommand extends BuckwheatCommand {
    protected _showTime: boolean = true
    protected _canUseOnSelf: boolean = false

    override needData: boolean = true
    override isSupportReply: boolean = true
    override minimumRank: number = RankUtils.admin

    protected abstract _execute(options: AdminExecuteOptions): Promise<boolean>

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            chatId,
            id,
            replyOrUserFrom,
            other = ''
        } = options
        const replyId = replyOrUserFrom.id

        const infinitive = ctx.t(`admin/${this.filename}/infinitive`)
        const passive = ctx.t(`admin/${this.filename}/passive`)

        const isSelf = id == replyId

        if (!this._canUseOnSelf && isSelf) {
            return {
                key: 'admin/total/no-reply',
                options: {
                    vars: {
                        infinitive
                    }
                }
            }
        }

        const user = await ctx.vars.user.get()
        const userRank = user?.rank ?? RankUtils.min

        const replyUser = !isSelf ?
            await UserService.get(chatId, replyId) :
            user
        const replyRank = replyUser?.rank ?? RankUtils.min

        if (!isSelf && !RankUtils.has(userRank, replyRank + 1)) {
            return {
                key: 'admin/total/low-rank',
                options: {
                    vars: {
                        reply: replyUser,
                        infinitive
                    }
                }
            }
        }

        const [rawTime, rawComment] = StringUtils.splitByCommands(other, 1)
        const time = TimeUtils.clamp(TimeUtils.parseTimeToMilliseconds(rawTime ?? ''))

        const reason = (time == TimeUtils.defaultTime ?
            other :
            rawComment ?? ''
        )
            .slice(0, MAX_USER_TEXT_LENGTH)

        const isExecuted = await this._execute({
            ctx,
            ms: time,
            id: replyId
        })

        if (!isExecuted) {
            return {
                key: 'admin/total/error',
                options: {
                    vars: {
                        infinitive,
                        reply: replyUser
                    }
                }
            }
        }

        return {
            key: 'admin/total/done',
            options: {
                vars: {
                    passive,
                    reply: replyUser,
                    user,
                    reason,
                    showTime: this._showTime,
                    time: TimeUtils.formatMillisecondsToTime(ctx, time, true)
                }
            }
        }
    }
}