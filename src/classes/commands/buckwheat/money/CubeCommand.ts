import BuckwheatCommand from '../../base/BuckwheatCommand'
import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import StringUtils from '../../../../utils/StringUtils'
import LegacyInlineKeyboardManager from '../../../main/LegacyInlineKeyboardManager'
import CasinoGetService from '../../../db/services/casino/CasinoGetService'
import CubeLastMessageService from '../../../db/services/cube/CubeLastMessageService'
import { MAX_DEBT } from '../../../../utils/values/consts'
import { BuckwheatCommandOptions } from '../../../../utils/values/types/action-options'

export default class CubeCommand extends BuckwheatCommand {
    protected _settingId: string = 'cube'

    constructor () {
        super()
        this._name = 'кубы'
        this._description = 'предлагает другому игроку сыграть в кубики на деньги или на интерес'
        this._replySupport = true
        this._needData = true
        this._argumentText = 'деньги'
        this._aliases = ['кубики']
    }

    async execute({ ctx, other, id: userId, chatId, replyFrom }: BuckwheatCommandOptions): Promise<void> {
        if (ctx.chat.type == 'private') {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/cubes/private.pug'
            )
            return
        }

        if (replyFrom) {
            const replyId = replyFrom.id

            if (userId == replyId) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/cubes/no-reply.pug'
                )
                return
            }

            const isBot = replyFrom.is_bot
            const firstId = isBot ? replyId : userId
            const secondId = isBot ? userId : replyId

            const rawMoney = StringUtils.getNumberFromString(other ?? '0')
            const needMoney = Math.min(
                Math.ceil(other && !isNaN(rawMoney) ? rawMoney : 0),
                await CasinoGetService.money(chatId, firstId) + MAX_DEBT
            )

            if (needMoney < 0) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/cubes/negative.pug'
                )
                return
            }

            const first = await ContextUtils.getUser(chatId, firstId)
            const second = await ContextUtils.getUser(chatId, secondId)

            const message = await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/cubes/done.pug',
                {
                    changeValues: {
                        first,
                        second,
                        cost: needMoney
                    },
                    inlineKeyboard: await LegacyInlineKeyboardManager.get(
                        'cubes',
                        JSON.stringify({
                            r: secondId,
                            u: firstId,
                            m: needMoney
                        })
                    )
                }
            )

            const lastMessages = await Promise.all([userId]
                .map(async id =>
                    ({ id, lastMessage: await CubeLastMessageService.get(chatId, userId) })
                ))

            for (const { id, lastMessage } of lastMessages) {
                if (lastMessage) {
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