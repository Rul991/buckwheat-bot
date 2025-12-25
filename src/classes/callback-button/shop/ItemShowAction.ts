import { JSONSchemaType } from 'ajv'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import CallbackButtonAction from '../CallbackButtonAction'
import ContextUtils from '../../../utils/ContextUtils'
import ShopItems from '../../../utils/ShopItems'
import MessageUtils from '../../../utils/MessageUtils'

type Data = {
    id: number
    p: number
    i: number
    cnt?: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: JSONSchemaType<Data> = {
        type: 'object',
        required: ['id', 'p', 'i'],
        properties: {
            id: {
                type: 'number',
            },
            p: {
                type: 'number'
            },
            i: {
                type: 'number'
            },
            cnt: {
                type: 'number',
                nullable: true
            }
        }
    }

    constructor() {
        super()
        this._name = 'itemshow'
    }

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            data,
            ctx,
            chatId
        } = options

        const {
            id,
            p: page,
            i: index,
            cnt: count = 1
        } = data

        if(await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        const message = await ShopItems.getShopMessage({
            index,
            chatId,
            userId: id,
            count,
            page
        })

        if(!message) return

        const {
            text,
            options: messageOptions
        } = message

        await MessageUtils.editText(
            ctx,
            text,
            messageOptions
        )
    }
}