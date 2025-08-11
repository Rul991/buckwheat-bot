import { DEFAULT_USER_NAME, RUBLE_TO_COIN } from '../../utils/consts'
import ContextUtils from '../../utils/ContextUtils'
import MessageUtils from '../../utils/MessageUtils'
import RankUtils from '../../utils/RankUtils'
import { TextContext, MaybeString } from '../../utils/types'
import CasinoAddService from '../db/services/casino/CasinoAddService'
import UserNameService from '../db/services/user/UserNameService'
import UserRankService from '../db/services/user/UserRankService'
import BuckwheatCommand from './base/BuckwheatCommand'

export default class DonateCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'донат'
        this._description = `передаю деньги от вселенной донатерам\nкурс следующий: 1 рубль к ${RUBLE_TO_COIN} монетам`
        this._needData = true
        this._argumentText = 'рубли'
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        const userId = ctx.from.id
        const userRank = await UserRankService.get(userId)

        if(userRank < RankUtils.adminRank) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/donate/no-admin.pug'
            )
            return
        }

        if(!ctx.message.reply_to_message) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/donate/no-reply.pug'
            )
            return
        }

        if(!other) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/donate/no-other.pug'
            )
            return
        }
        
        if(isNaN(+other) || +other < 0) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/donate/wrong-other.pug'
            )
            return
        }

        const replyId = ctx.message.reply_to_message.from?.id ?? 0
        const replyRank = await UserRankService.get(replyId)
        const replyValues = {
            link: ContextUtils.getLinkUrl(replyId),
            name: await UserNameService.get(replyId) ?? DEFAULT_USER_NAME
        }

        if(replyRank >= RankUtils.adminRank) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/donate/high-rank.pug',
                {
                    changeValues: replyValues
                }
            )
            return
        }

        const rubles = Math.ceil(+other)
        const coins = Math.ceil(rubles * RUBLE_TO_COIN)

        await CasinoAddService.addMoney(replyId, coins)
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/donate/done.pug',
            {
                changeValues: {
                    ...replyValues,
                    coins,
                    rubles
                }
            }
        )
    }
}