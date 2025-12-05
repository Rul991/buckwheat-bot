import { JSONSchemaType } from 'ajv'
import CallbackButtonAction from '../../CallbackButtonAction'
import { CallbackButtonContext } from '../../../../utils/values/types/types'
import ContextUtils from '../../../../utils/ContextUtils'
import MessageUtils from '../../../../utils/MessageUtils'

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
        this._name = 'csug'
    }

    async execute(ctx: CallbackButtonContext, data: Data): Promise<string | void> {
        const {
            id
        } = data
        if(await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        await ctx.scene.enter('suggest-card')
        await MessageUtils.deleteMessage(ctx)
    }
}