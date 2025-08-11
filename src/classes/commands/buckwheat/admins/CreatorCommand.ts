import { Context } from 'telegraf'
import { MaybeString, TextContext } from '../../../../utils/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import UserRankService from '../../../db/services/user/UserRankService'
import RankUtils from '../../../../utils/RankUtils'
import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'

export default class CreatorCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'создатель'
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        let member = await ctx.telegram.getChatMember(ctx.chat?.id ?? '', ctx.from?.id ?? 0)

        if(member.status == 'creator') {
            await UserRankService.update(ctx.from?.id ?? 0, RankUtils.maxRank)
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/creator/done.html',
                {
                    changeValues: {
                        rank: RankUtils.getRankByNumber(RankUtils.maxRank)
                    }
                }
            )
            return
        }

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/creator/error.html',
            {
                changeValues: {
                    dev: RankUtils.getDevStatusByNumber(RankUtils.maxRank)
                }
            }
        )
    }
}