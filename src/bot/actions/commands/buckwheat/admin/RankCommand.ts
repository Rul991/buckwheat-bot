import UserRankService from "../../../../../db/services/user/UserRankService"
import UserService from "../../../../../db/services/user/UserService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import StringUtils from "../../../../../utils/string/StringUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class RankCommand extends BuckwheatCommand {
    override aliases: string[] = ['ранк']
    override minimumRank: number = RankUtils.admin
    override settingId: number = 36
    override name: string = 'ранг'

    override isSupportReply: boolean = true
    override needData: boolean = true
    override filename: string = 'rank'

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            replyOrUserFrom,
            id,
            chatId,
            other,
        } = options
        const userRank = ctx.vars.user?.rank ?? RankUtils.min

        if(!other) {
            return {
                key: 'rank/no-other',
                options: {
                    vars: {
                        rank: await RankUtils.getVars(ctx, chatId, userRank)
                    }
                }
            }
        }

        const newRank = StringUtils.getNumberFromString(other, RankUtils.min)
        const needRank = newRank + 1

        if (!RankUtils.isClamp(newRank)) {
            return {
                key: 'rank/out-bounds',
            }
        }

        const isOwner = ctx.vars.isOwner
        const replyId = replyOrUserFrom.id
        const isSelf = replyId == id

        const user = ctx.vars.user
        const reply = isSelf ? ctx.vars.user : await UserService.get(chatId, replyId)

        const replyRank = isOwner || isSelf ?
            userRank :
            await UserRankService.get(chatId, replyId) ?? RankUtils.min

        if (!(isOwner || (RankUtils.has(userRank, replyRank + 1) && RankUtils.has(userRank, needRank)))) {
            return {
                key: 'rank/low-rank',
                options: {
                    vars: {
                        needRank: await RankUtils.getVars(ctx, chatId, needRank),
                        userRank: await RankUtils.getVars(ctx, chatId, userRank),
                        user,
                        reply
                    }
                }
            }
        }

        await UserRankService.set(chatId, replyId, newRank)
        return {
            key: 'rank/changed',
            options: {
                vars: {
                    newRank: await RankUtils.getVars(ctx, chatId, newRank),
                    reply
                }
            }
        }
    }
}