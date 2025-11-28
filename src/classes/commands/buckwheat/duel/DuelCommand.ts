import ContextUtils from '../../../../utils/ContextUtils'
import DuelUtils from '../../../../utils/DuelUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import { TextContext, MaybeString } from '../../../../utils/values/types/types'
import DuelService from '../../../db/services/duel/DuelService'
import DuelistService from '../../../db/services/duelist/DuelistService'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import UserClassService from '../../../db/services/user/UserClassService'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import BuckwheatCommand from '../../base/BuckwheatCommand'

export default class DuelCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'дуэль'
        this._aliases = [
            'вызов',
            'сразиться'
        ]
        this._description = 'выступаю посредником в дуэле'
        this._replySupport = true
    }

    async execute(ctx: TextContext, _: MaybeString): Promise<void> {
        if(ctx.chat.type == 'private') {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/duel/private.pug'
            )
            return
        }

        const replyUser = ctx.message.reply_to_message?.from

        if(!replyUser) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/duel/no-reply.pug'
            )
            return
        }

        const userId = ctx.from.id
        const replyId = replyUser.id

        if(userId == replyId) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/duel/same-reply.pug'
            )
            return
        }

        const chatId = await LinkedChatService.getCurrent(ctx, userId)
        if(!chatId) return

        if(!await UserClassService.isPlayer(chatId, userId)) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/duel/unknown.pug'
            )
            return
        }

        const user = await DuelService.getPriceStats(chatId, userId)
        const reply = await DuelService.getPriceStats(chatId, replyId)

        const userLink = await ContextUtils.getUser(chatId, userId)
        const replyLink = await ContextUtils.getUser(chatId, replyId)

        const options = {chatId, ctx, userId, replyId, isUserFirst: false}
        const lowOptions = await DuelUtils.getLowOptions(options)
        
        if(!await DuelUtils.sendOnDuelMessage(lowOptions)) return
        if(!await DuelUtils.checkStatsAndSendMessage(options)) return

        await DuelistService.setField(chatId, userId, 'onDuel', true)
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/duel/yes-offer/offer.pug',
            {
                changeValues: {
                    user: {
                        ...userLink,
                        price: user.price
                    },
                    reply: {
                        ...replyLink,
                        price: reply.price
                    },
                },
                inlineKeyboard: await InlineKeyboardManager.get(
                    'duels/offer',
                    JSON.stringify({
                        user: userId,
                        reply: replyId
                    })
                )
            }
        )
    }
}