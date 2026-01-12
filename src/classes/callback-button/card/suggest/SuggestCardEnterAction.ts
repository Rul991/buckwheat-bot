import { ZodType } from 'zod'
import CallbackButtonAction from '../../CallbackButtonAction'
import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'
import { CallbackButtonOptions } from '../../../../utils/values/types/action-options'
import { idSchema } from '../../../../utils/values/schemas'

type Data = {
    id: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = idSchema

    constructor() {
        super()
        this._name = 'csug'
    }

    async execute({ctx, data}: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            id
        } = data
        if(await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        await ctx.scene.enter('suggest-card')
        await MessageUtils.deleteMessage(ctx)
    }
}