import { ZodType } from 'zod'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import CallbackButtonAction from '../CallbackButtonAction'
import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import { dataSchema } from '../../../utils/values/schemas'

type Data = {
    id: number
    n: string
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = dataSchema

    constructor() {
        super()
        this._name = 'import'
    }

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            ctx,
            chatId,
            data
        } = options

        const {
            id,
            n: name
        } = data
        if(await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        await ctx.scene.enter(
            'import', 
            {
                id,
                name,
                chatId
            }
        )
        await MessageUtils.deleteMessage(ctx)
    }
}