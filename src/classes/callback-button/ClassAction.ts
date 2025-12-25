import { JSONSchemaType } from 'ajv'
import ClassData from '../../interfaces/callback-button-data/ClassData'
import ClassUtils from '../../utils/ClassUtils'
import ContextUtils from '../../utils/ContextUtils'
import MessageUtils from '../../utils/MessageUtils'
import { CallbackButtonContext } from '../../utils/values/types/contexts'
import LinkedChatService from '../db/services/linkedChat/LinkedChatService'
import UserClassService from '../db/services/user/UserClassService'
import CallbackButtonAction from './CallbackButtonAction'
import FileUtils from '../../utils/FileUtils'
import { CallbackButtonOptions } from '../../utils/values/types/action-options'

export default class ClassAction extends CallbackButtonAction<ClassData> {
    protected _schema: JSONSchemaType<ClassData> = {
        type: 'object',
        properties: {
            classType: {
                type: 'string'
            },
            userId: {
                type: 'number'
            }
        },
        required: ['classType', 'userId']
    }

    constructor() {
        super()
        this._name = 'class'
    }

    async execute({ctx, data, chatId, id}: CallbackButtonOptions<ClassData>): Promise<string | void> {
        const {userId, classType} = data

        if(userId == id) {
            await UserClassService.update(chatId, id, classType)
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/actions/class/change.pug',
                {
                    changeValues: {
                        user: await ContextUtils.getUserFromContext(ctx),
                        className: ClassUtils.getName(classType)
                    }
                }
            )
            await MessageUtils.deleteMessage(ctx)
        }
        else {
            await ContextUtils.showCallbackMessageFromFile(ctx)
        }
    }
}