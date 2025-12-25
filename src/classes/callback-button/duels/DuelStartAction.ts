import { JSONSchemaType } from 'ajv'
import UserReplyIdsData from '../../../interfaces/callback-button-data/UserReplyIdsData'
import { CallbackButtonContext } from '../../../utils/values/types/contexts'
import CallbackButtonAction from '../CallbackButtonAction'
import DuelService from '../../db/services/duel/DuelService'
import MessageUtils from '../../../utils/MessageUtils'
import ContextUtils from '../../../utils/ContextUtils'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import DuelUtils from '../../../utils/DuelUtils'
import FileUtils from '../../../utils/FileUtils'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'

type Data = UserReplyIdsData & {
    bid?: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: JSONSchemaType<Data> = {
        type: 'object',
        properties: {
            reply: {
                type: 'number'
            },
            user: {
                type: 'number'
            },
            bid: {
                type: 'number',
                nullable: true
            }
        },
        required: ['reply', 'user']
    }

    constructor () {
        super()
        this._name = 'duelstart'
    }

    async execute({ctx, data, chatId}: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            user,
            reply,
            bid
        } = data

        if (await ContextUtils.showAlertIfIdNotEqual(ctx, user)) return

        const duel = await DuelService.create({
            bidId: bid,
            firstDuelist: user,
            secondDuelist: reply,
            chatId
        })

        const { text, keyboard } = await DuelUtils.getParamsForFightMessage(chatId, duel)

        await MessageUtils.answer(
            ctx,
            text,
            {
                inlineKeyboard: keyboard
            }
        )
        await MessageUtils.deleteMessage(ctx)
    }
}