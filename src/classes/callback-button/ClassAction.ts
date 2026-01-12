import { literal, number, object, ZodType } from 'zod'
import ClassData from '../../interfaces/callback-button-data/ClassData'
import ClassUtils from '../../utils/ClassUtils'
import ContextUtils from '../../utils/ContextUtils'
import MessageUtils from '../../utils/MessageUtils'
import UserClassService from '../db/services/user/UserClassService'
import CallbackButtonAction from './CallbackButtonAction'
import { CallbackButtonOptions } from '../../utils/values/types/action-options'
import { classTypesSchema } from '../../utils/values/schemas'

export default class ClassAction extends CallbackButtonAction<ClassData> {
    protected _schema: ZodType<ClassData> = object({
        classType: classTypesSchema,
        userId: number()
    })

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