import Marriage from "../../../../../db/entities/marriage/Marriage"
import MarriageService from "../../../../../db/services/marriage/MarriageService"
import UserService from "../../../../../db/services/user/UserService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import TimeUtils from "../../../../../utils/time/TimeUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class MarriageCommand extends BuckwheatCommand {
    override aliases: string[] = ['семья', 'отношения']
    override filename: string = 'marriage'
    override minimumRank: number = RankUtils.min
    override settingId: number = 99
    override name: string = 'брак'
    override isSupportReply: boolean = true
    
    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            chatId,
            id,
            ctx,
            replyOrUserFrom
        } = options

        const replyId = replyOrUserFrom.id
        const isSelf = replyId == id
        const user = isSelf ? await ctx.vars.user.get() : await UserService.get(chatId, replyId)
        const marriage = await MarriageService.get(
            chatId,
            replyId
        )

        const partnerId = marriage ?
            Marriage.getPartner(marriage, replyId) : 
            undefined
        const partner = partnerId ? await UserService.get(chatId, partnerId) : undefined

        return {
            key: 'marriage/info',
            options: {
                vars: {
                    partner,
                    user,
                    time: TimeUtils.formatMillisecondsToTime(
                        ctx,
                        TimeUtils.getElapsed(+(marriage?.createdAt ?? 0))
                    )
                }
            }
        }
    }
}