import { Message } from 'telegraf/types'
import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import DuelService from '../../db/services/duel/DuelService'
import DuelistService from '../../db/services/duelist/DuelistService'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import ConditionalCommand from '../base/ConditionalCommand'
import { ConditionalCommandOptions } from '../../../utils/values/types/action-options'

export default class extends ConditionalCommand {
    protected async _condition({ ctx, chatId, id }: ConditionalCommandOptions): Promise<boolean> {
        return await DuelistService.getField(
            chatId,
            id,
            'onDuel'
        ) ?? false
    }

    protected async _execute({ ctx, chatId, id }: ConditionalCommandOptions): Promise<void> {
        const duel = await DuelService.getByUserId(chatId, id)
        let message: Message.TextMessage
        
        if(duel) {
            const duelId = duel.id

            message = await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/duel/fight/other-command.pug',
                {
                    changeValues: {
                        user: await ContextUtils.getUser(chatId, id)
                    },
                    inlineKeyboard: await InlineKeyboardManager.get(
                        `duels/away${id == duel.step.duelist ? '-duel' : ''}`,
                        {
                            id: JSON.stringify({userId: id}),
                            user: JSON.stringify({ v: id, t: 'u' }),
                            duel: JSON.stringify({id: duelId})
                        }
                    )
                }
            )
        }
        else {
            message = await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/duel/fight/offer-command.pug',
                {
                    changeValues: {
                        user: await ContextUtils.getUser(chatId, id)
                    },
                    inlineKeyboard: await InlineKeyboardManager.get(
                        'duels/offer-command',
                        {
                            yes: JSON.stringify({user: id, reply: id}),
                            no: JSON.stringify({isSecure: true, userId: id})
                        }
                    )
                }
            )
        }

        await DuelistService.deleteAndUpdateLastMessage(ctx, message.message_id)
    }
}