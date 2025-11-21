import { JSONSchemaType } from 'ajv'
import CallbackButtonAction from '../CallbackButtonAction'
import { CallbackButtonContext } from '../../../utils/values/types'
import ContextUtils from '../../../utils/ContextUtils'
import DuelService from '../../db/services/duel/DuelService'
import DuelUtils from '../../../utils/DuelUtils'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import MessageUtils from '../../../utils/MessageUtils'
import FileUtils from '../../../utils/FileUtils'

type Data = {
    id: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: JSONSchemaType<Data> = {
        type: 'object',
        properties: {
            id: { type: 'number' }
        },
        required: ['id']
    }

    constructor() {
        super()
        this._name = 'duelfight'
    }

    async execute(ctx: CallbackButtonContext, {id}: Data): Promise<string | void> {
        const userId = ctx.from.id
        const chatId = await LinkedChatService.getCurrent(ctx, userId)
        if(!chatId) return await FileUtils.readPugFromResource('text/actions/other/no-chat-id.pug')

        const duel = await DuelService.get(id)
        if(!duel) return await FileUtils.readPugFromResource('text/actions/duel/hasnt.pug')
        if(await DuelUtils.showAlertIfCantUse(ctx, id)) return

        const {text, keyboard} = await DuelUtils.getParamsForFightMessage(chatId, duel)

        await MessageUtils.editText(
            ctx,
            text,
            {
                reply_markup: {
                    inline_keyboard: keyboard
                }
            }
        )
    }
}