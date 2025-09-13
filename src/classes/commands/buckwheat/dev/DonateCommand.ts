import { CHAT_ID, RUBLE_TO_COIN } from '../../../../utils/values/consts'
import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import RankUtils from '../../../../utils/RankUtils'
import { TextContext, MaybeString } from '../../../../utils/values/types'
import CasinoAddService from '../../../db/services/casino/CasinoAddService'
import UserRankService from '../../../db/services/user/UserRankService'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'

export default class DonateCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'донат'
        this._isShow = false
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        const chatId = await LinkedChatService.getChatId(ctx)
        if(!chatId) return
        const userId = ctx.from.id
        const userRank = await UserRankService.get(chatId, userId)

        if(chatId != CHAT_ID) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/donate/wrong-chat.pug'
            )
            return
        }

        if(userRank < RankUtils.admin) {
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
        
        if(isNaN(+other)) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/donate/wrong-other.pug'
            )
            return
        }

        const replyId = ctx.message.reply_to_message.from?.id ?? 0
        const replyRank = await UserRankService.get(chatId, replyId)
        const replyValues = await ContextUtils.getUser(chatId, replyId)

        if(replyRank >= RankUtils.admin || !RankUtils.canUse({
            userRank: replyRank,
            id: userId
        })) {
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

        await CasinoAddService.addMoney(chatId, replyId, coins)
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