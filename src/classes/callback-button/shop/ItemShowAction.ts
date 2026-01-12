import { number, object, ZodType } from 'zod'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import CallbackButtonAction from '../CallbackButtonAction'
import ContextUtils from '../../../utils/ContextUtils'
import ShopItems from '../../../utils/ShopItems'
import MessageUtils from '../../../utils/MessageUtils'
import { idSchema } from '../../../utils/values/schemas'

type Data = {
    id: number
    p: number
    i: number
    cnt?: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = idSchema
        .and(object({
            p: number(),
            i: number(),
            cnt: number().optional()
        }))

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