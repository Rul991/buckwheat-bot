import { number, object, string, ZodType } from 'zod'
import { CallbackButtonOptions } from '../../../../utils/values/types/action-options'
import CallbackButtonAction from '../../CallbackButtonAction'
import { idSchema } from '../../../../utils/values/schemas'
import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'

type Data = {
    id: number
    itemId: string
    count: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> | null = idSchema
        .and(object({
            itemId: string(),
            count: number()
        }))

    constructor() {
        super()
        this._name = 'marketsell'
        this._buttonTitle = 'Рынок: Продажа'
    }

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            data,
            ctx,
            chatId
        } = options

        const {
            id
        } = data
        if(await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        await MessageUtils.editMarkup(ctx)
        await ctx.scene.enter(
            'market-sell',
            {
                ...data,
                chatId
            }
        )
    }
}