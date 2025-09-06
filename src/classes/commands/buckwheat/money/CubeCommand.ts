import { MaybeString, TextContext } from '../../../../utils/values/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import CasinoGetService from '../../../db/services/casino/CasinoGetService'
import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import StringUtils from '../../../../utils/StringUtils'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import CallbackButtonManager from '../../../main/CallbackButtonManager'
import { MAX_DEBT_PRICE } from '../../../../utils/values/consts'

export default class CubeCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'кубы'
        this._description = 'предлагает другому игроку сыграть в кубики на деньги или на интерес'
        this._replySupport = true
        this._needData = true
        this._argumentText = 'деньги'
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        if(ctx.message && 'reply_to_message' in ctx.message) {
            if(ctx.message.reply_to_message?.from?.is_bot) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/cubes/bot.pug',
                    {
                        changeValues: {
                            name: ctx.message.reply_to_message.from.first_name
                        }
                    }
                )
                return
            }

            const chatId = await LinkedChatService.getChatId(ctx)
            if(!chatId) return
            const replyId = ctx.message.reply_to_message?.from?.id ?? 0
            const userId = ctx.from.id

            if(userId == replyId) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/cubes/no-reply.pug'
                )
                return
            }

            const userMoney = await CasinoGetService.getMoney(chatId, userId)
            const replyMoney = await CasinoGetService.getMoney(chatId, replyId)
            const needMoney = Math.ceil(other && !isNaN(+other) ? +other : 0)

            if(needMoney < 0) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/cubes/negative.pug'
                )
                return
            }

            if(userMoney < needMoney) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/cubes/not-enough.pug'
                )
                return
            }

            if(needMoney - replyMoney >= MAX_DEBT_PRICE) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/cubes/debt-diff.pug'
                )
                return
            }

            if(replyMoney <= 0 && needMoney > 0) {
                await MessageUtils.answerMessageFromResource(
                    ctx, 
                    'text/commands/cubes/zero-money.pug'
                )
                return
            }

            const user = await ContextUtils.getUser(chatId, userId)
            const reply = await ContextUtils.getUser(chatId, replyId)

            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/cubes/done.pug',
                {
                    changeValues: {
                        replyUrl: reply.link,
                        userUrl: user.link,
                        replyName: reply.name,
                        userName: user.name,
                        cost: needMoney > 0 ? `${StringUtils.toFormattedNumber(needMoney)} монет` : 'интерес',
                        isReplyHasNeedMoney: replyMoney >= needMoney
                    },
                    inlineKeyboard: await CallbackButtonManager.get('cubes', `${replyId}_${userId}_${needMoney}`)
                }
            )
        }
        else {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/cubes/no-reply.pug'
            )
        }
    }
}