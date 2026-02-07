import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import DuelService from '../../db/services/duel/DuelService'
import DuelistService from '../../db/services/duelist/DuelistService'
import LegacyInlineKeyboardManager from '../../main/LegacyInlineKeyboardManager'
import ConditionalCommand from '../base/ConditionalCommand'
import { ConditionalCommandOptions } from '../../../utils/values/types/action-options'
import Duel from '../../../interfaces/schemas/duels/Duel'
import ReplaceOptions from '../../../interfaces/options/ReplaceOptions'
import DuelCheckService from '../../db/services/duel/DuelCheckService'

type DuelHandlerOptions = NoDuelHandlerOptions & {
    duel: Duel
}
type NoDuelHandlerOptions = ConditionalCommandOptions & {
    changeValues: ReplaceOptions['changeValues']
}

export default class extends ConditionalCommand {
    protected async _condition({ chatId, id }: ConditionalCommandOptions): Promise<boolean> {
        return await DuelistService.getField(
            chatId,
            id,
            'onDuel'
        ) ?? false
    }

    protected async _duelHandle({ ctx, id, duel, changeValues }: DuelHandlerOptions) {
        const duelId = duel.id

        const cantUse = await DuelCheckService.cantUse(duel, id)
        const message = await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/duel/fight/other-command.pug',
            {
                changeValues,
                inlineKeyboard: await LegacyInlineKeyboardManager.get(
                    `duels/away-${cantUse ? 'enemy' : 'you'}`,
                    {
                        id: JSON.stringify({ id }),
                        duel: JSON.stringify({ id: duelId }),
                        deleteMessage: JSON.stringify({ userId: id })
                    }
                )
            }
        )

        return message
    }

    protected async _execute(options: ConditionalCommandOptions): Promise<void> {
        const { ctx, chatId, id } = options
        const duel = await DuelService.getByUserId(chatId, id)
        if (!duel) return

        const changeValues = {
            user: await ContextUtils.getUser(chatId, id)
        }

        const handlerOptions = {
            ...options,
            changeValues
        }

        const message = await this._duelHandle({ ...handlerOptions, duel })
        const {
            message_id: messageId
        } = message

        await DuelistService.deleteAndUpdateLastMessage(ctx, messageId)
    }
}