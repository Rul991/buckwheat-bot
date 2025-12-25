import { JSONSchemaType } from 'ajv'
import DeleteMessageData from '../../interfaces/callback-button-data/DeleteMessageData'
import MessageUtils from '../../utils/MessageUtils'
import { CallbackButtonContext } from '../../utils/values/types/contexts'
import CallbackButtonAction from './CallbackButtonAction'
import ContextUtils from '../../utils/ContextUtils'
import { CallbackButtonOptions } from '../../utils/values/types/action-options'

export default class DeleteMessageAction extends CallbackButtonAction<DeleteMessageData> {
    protected _schema: JSONSchemaType<DeleteMessageData> = {
        type: 'object',
        properties: {
            userId: {
                type: 'number'
            },
            isSecure: {
                type: 'boolean'
            },
        },
        required: ['userId', 'isSecure']
    }

    constructor() {
        super()
        this._name = 'deletemessage'
    }

    async execute({ctx, data, id}: CallbackButtonOptions<DeleteMessageData>): Promise<string | void> {
        let isCanDelete = true

        const {userId, isSecure} = data
        
        if(isSecure) {
            isCanDelete = id == userId
        }

        if(isCanDelete) {
            await MessageUtils.deleteMessage(ctx)
        }
        else {
            await ContextUtils.showAlertFromFile(ctx)
        }
    }
}