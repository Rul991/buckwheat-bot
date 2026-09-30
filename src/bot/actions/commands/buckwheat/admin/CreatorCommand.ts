import { DEV_ID } from "../../../../../consts/env"
import UserRankService from "../../../../../db/services/user/UserRankService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class CreatorCommand extends BuckwheatCommand {
    override aliases: string[] = ['гнида', 'основатель']
    override minimumRank: number = RankUtils.max
    override name: string = 'создатель'
    override filename: string = 'creator'
    override settingId: number = 2

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            chatId,
            id,
            ctx
        } = options
        const rank = DEV_ID == id ? RankUtils.owner : RankUtils.max
        const user = await ctx.vars.user.require()

        await UserRankService.set(
            chatId,
            id,
            rank
        )

        return {
            key: 'creator/owner',
            options: {
                vars: {
                    rank: await RankUtils.getVars(ctx, chatId, rank),
                    user
                }
            }
        }
    }
}