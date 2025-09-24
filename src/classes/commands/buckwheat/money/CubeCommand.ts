import { MaybeString, TextContext } from '../../../../utils/values/types'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import CasinoGetService from '../../../db/services/casino/CasinoGetService'
import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import StringUtils from '../../../../utils/StringUtils'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import { MAX_DEBT_PRICE } from '../../../../utils/values/consts'
import CubePlayingService from '../../../db/services/cube/CubePlayingService'

export default class CubeCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'кубы'
        this._description = 'предлагает другому игроку сыграть в кубики на деньги или на интерес'
        this._replySupport = true
        this._needData = true
        this._argumentText = 'деньги'
        this._aliases = ['кубики']
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

            const chatId = await LinkedChatService.getCurrent(ctx)
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

            if(await CubePlayingService.get(chatId, userId)) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/cubes/playing.pug',
                    {changeValues: await ContextUtils.getUser(chatId, userId)}
                )
                return
            }

            const userMoney = await CasinoGetService.money(chatId, userId)
            const replyMoney = await CasinoGetService.money(chatId, replyId)

            const rawMoney = StringUtils.getNumberFromString(other ?? '0')
            const needMoney = Math.ceil(other && !isNaN(rawMoney) ? rawMoney : 0)

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

            await CubePlayingService.set(chatId, userId, true)

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
                    inlineKeyboard: await InlineKeyboardManager.get('cubes', `${replyId}_${userId}_${needMoney}`)
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