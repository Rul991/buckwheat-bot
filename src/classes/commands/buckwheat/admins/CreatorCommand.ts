import { Context } from 'telegraf'
import { MaybeString } from '../../../../utils/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import UserRankService from '../../../db/services/user/UserRankService'
import RankUtils from '../../../../utils/RankUtils'
import ContextUtils from '../../../../utils/ContextUtils'

export default class CreatorCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'создатель'
    }

    async execute(ctx: Context, other: MaybeString): Promise<void> {
        let admins = await ctx.telegram.getChatAdministrators(ctx.chat?.id ?? '')

        for (const admin of admins) {
            if(admin.user.id == ctx.from?.id && admin.status == 'creator') {
                await UserRankService.update(ctx.from.id ?? 0, RankUtils.maxRank)
                await ContextUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/creator/done.html',
                    {
                        rank: RankUtils.getRankByNumber(RankUtils.maxRank)
                    }
                )
                return
            }
        }

        await ContextUtils.answerMessageFromResource(
            ctx,
            'text/commands/creator/error.html',
            {
                dev: RankUtils.getDevStatusByNumber(RankUtils.maxRank)
            }
        )
    }
}