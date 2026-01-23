import { MaybeString } from '../../../../utils/values/types/types'
import { TextContext } from '../../../../utils/values/types/contexts'
import BuckwheatCommand from '../../base/BuckwheatCommand'
import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import StringUtils from '../../../../utils/StringUtils'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import InlineKeyboardManager from '../../../main/InlineKeyboardManager'
import CasinoGetService from '../../../db/services/casino/CasinoGetService'
import CubeLastMessageService from '../../../db/services/cube/CubeLastMessageService'
import { MAX_DEBT } from '../../../../utils/values/consts'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'

export default class CubeCommand extends BuckwheatCommand {
    protected _settingId: string = 'cube'

    constructor() {
        super()
        this._name = 'кубы'
        this._description = 'предлагает другому игроку сыграть в кубики на деньги или на интерес'
        this._replySupport = true
        this._needData = true
        this._argumentText = 'деньги'
        this._aliases = ['кубики']
    }

    async execute({ ctx, other, id: userId, chatId, replyFrom }: BuckwheatCommandOptions): Promise<void> {
        if(replyFrom) {
            if(replyFrom.is_bot) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/cubes/bot.pug',
                    {
                        changeValues: {
                            name: replyFrom.first_name
                        }
                    }
                )
                return
            }

            const replyId = replyFrom.id
            if(userId == replyId) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/cubes/no-reply.pug'
                )
                return
            }

            const rawMoney = StringUtils.getNumberFromString(other ?? '0')
            const needMoney = Math.min(
                Math.ceil(other && !isNaN(rawMoney) ? rawMoney : 0),
                await CasinoGetService.money(chatId, userId) + MAX_DEBT
            )

            if(needMoney < 0) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/cubes/negative.pug'
                )
                return
            }

            const user = await ContextUtils.getUser(chatId, userId)
            const reply = await ContextUtils.getUser(chatId, replyId)

            const message = await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/cubes/done.pug',
                {
                    changeValues: {
                        replyUrl: reply.link,
                        userUrl: user.link,
                        replyName: reply.name,
                        userName: user.name,
                        cost: needMoney > 0 ? `${StringUtils.toFormattedNumber(needMoney)} монет` : 'интерес'
                    },
                    inlineKeyboard: await InlineKeyboardManager.get('cubes', JSON.stringify({
                        r: replyId,
                        u: userId,
                        m: needMoney
                    }))
                }
            )

            const lastMessages = await Promise.all([userId]
                .map(async id => 
                    ({id, lastMessage: await CubeLastMessageService.get(chatId, userId)})
                ))

            for (const {id, lastMessage} of lastMessages) {
                if(lastMessage) {
                    await MessageUtils.deleteMessage(ctx, lastMessage)
                }
                await CubeLastMessageService.set(chatId, id, message.message_id)
            }
        }
        else {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/cubes/no-reply.pug'
            )
        }
    }
}