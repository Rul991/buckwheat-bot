import { JSONSchemaType } from 'ajv'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import CallbackButtonAction from '../CallbackButtonAction'
import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'

type Data = {
    id: number
    n: string
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: JSONSchemaType<Data> = {
        type: 'object',
        properties: {
            id: {
                type: 'number'
            },
            n: {
                type: 'string'
            }
        },
        required: ['id', 'n']
    }

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