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
import DuelStepUtils from '../../../utils/duel/DuelStepUtils'
import DuelUtils from '../../../utils/duel/DuelUtils'

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

    protected async _execute(options: ConditionalCommandOptions): Promise<boolean | void> {
        const { ctx, chatId, id } = options
        const duel = await DuelService.getByUserId(chatId, id)
        if (!duel) {
            await DuelistService.setField(
                chatId,
                id,
                'onDuel',
                false
            )
            return false
        }

        const isTimeOut = DuelStepUtils.isTimeOut(duel)

        if (isTimeOut) {
            await DuelUtils.end({
                chatId,
                ctx,
                duel,
                winner: DuelStepUtils.getOther(duel)
            })
        }
        else {
            const handleOptions = {
                ...options,
                changeValues: {
                    user: await ContextUtils.getUser(chatId, id)
                },
                duel
            }

            const message = await this._duelHandle(handleOptions)
            const {
                message_id: messageId
            } = message

            await DuelistService.deleteAndUpdateLastMessage(ctx, messageId)
        }
    }
}