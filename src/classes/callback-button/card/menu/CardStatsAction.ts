import { JSONSchemaType } from 'ajv'
import CallbackButtonAction from '../../CallbackButtonAction'
import { CallbackButtonContext } from '../../../../utils/values/types/types'
import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import FileUtils from '../../../../utils/FileUtils'
import CardsService from '../../../db/services/card/CardsService'
import LinkedChatService from '../../../db/services/linkedChat/LinkedChatService'
import StringUtils from '../../../../utils/StringUtils'
import CardService from '../../../db/services/card/CardService'
import CardUtils from '../../../../utils/CardUtils'

type Data = {
    id: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: JSONSchemaType<Data> = {
        type: 'object',
        properties: {
            id: {
                type: 'number'
            }
        },
        required: ['id']
    }

    constructor() {
        super()
        this._name = 'cstat'
    }

    async execute(ctx: CallbackButtonContext, data: Data): Promise<string | void> {
        const {
            id
        } = data
        if(await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if(!chatId) return await FileUtils.readPugFromResource('text/actions/other/no-chat-id.pug')

        const unique = await CardsService.getCards(chatId, id)
        const total = await CardService.getAvailable()
        const inventoryTotal = CardUtils.getTotalCount(unique)
        const user = await ContextUtils.getUser(chatId, id)

        await MessageUtils.editText(
            ctx,
            await FileUtils.readPugFromResource(
                'text/commands/cards/stats.pug',
                {
                    changeValues: {
                        unique: StringUtils.toFormattedNumber(unique.length),
                        length: StringUtils.toFormattedNumber(total.length),
                        total: StringUtils.toFormattedNumber(inventoryTotal),
                        user,
                    }
                }
            )
        )
    }
}