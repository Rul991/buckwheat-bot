import { JSONSchemaType } from 'ajv'
import ClassData from '../../interfaces/callback-button-data/ClassData'
import ClassUtils from '../../utils/ClassUtils'
import ContextUtils from '../../utils/ContextUtils'
import MessageUtils from '../../utils/MessageUtils'
import { CallbackButtonContext } from '../../utils/values/types'
import LinkedChatService from '../db/services/linkedChat/LinkedChatService'
import UserClassService from '../db/services/user/UserClassService'
import CallbackButtonAction from './CallbackButtonAction'
import FileUtils from '../../utils/FileUtils'

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

    async execute(ctx: CallbackButtonContext, data: ClassData): Promise<string | void> {
        const chatId = await LinkedChatService.getCurrent(ctx)
        if(!chatId) return await FileUtils.readPugFromResource('text/actions/other/no-chat-id.pug')

        const {userId, classType} = data

        if(userId == ctx.from.id) {
            await UserClassService.update(chatId, ctx.from.id, classType)
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