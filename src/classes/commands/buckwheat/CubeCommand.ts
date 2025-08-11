import { Context } from 'telegraf'
import { MaybeString, TextContext } from '../../../utils/types'
import BuckwheatCommand from '../base/BuckwheatCommand'
import CasinoGetService from '../../db/services/casino/CasinoGetService'
import ContextUtils from '../../../utils/ContextUtils'
import UserNameService from '../../db/services/user/UserNameService'
import { DEFAULT_USER_NAME } from '../../../utils/consts'
import MessageUtils from '../../../utils/MessageUtils'

export default class CubeCommand extends BuckwheatCommand {
    constructor() {
        super()
        this._name = 'кубы'
    }

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        if(ctx.message && 'reply_to_message' in ctx.message) {
            if(ctx.message.reply_to_message?.from?.is_bot) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/cubes/bot.html',
                    {
                        changeValues: {
                            name: ctx.message.reply_to_message.from.first_name
                        }
                    }
                )
                return
            }

            const replyId = ctx.message.reply_to_message?.from?.id ?? 0
            const userId = ctx.from?.id ?? 0

            if(userId == replyId) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/cubes/no-reply.html'
                )
                return
            }

            const userMoney = await CasinoGetService.getMoney(userId)
            const needMoney = Math.ceil(other && !isNaN(+other) ? +other : 0)

            if(needMoney < 0) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/cubes/negative.html'
                )
                return
            }

            if(userMoney < needMoney) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/cubes/not-enough.html'
                )
                return
            }

            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/cubes/done.html',
                {
                    changeValues: {
                        replyUrl: ContextUtils.getLinkUrl(replyId),
                        userUrl: ContextUtils.getLinkUrl(userId),
                        replyName: await UserNameService.get(replyId) ?? DEFAULT_USER_NAME,
                        userName: await UserNameService.get(userId) ?? DEFAULT_USER_NAME,
                        cost: needMoney > 0 ? `${needMoney} монет` : 'интерес'
                    },
                    inlineKeyboard: ['cubes', `${replyId}_${userId}_${needMoney}`]
                }
            )
        }
        else {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/cubes/no-reply.html'
            )
        }
    }
}