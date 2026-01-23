import { ZodType } from 'zod'
import UserReplyIdsData from '../../../interfaces/callback-button-data/UserReplyIdsData'
import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import CallbackButtonAction from '../CallbackButtonAction'
import { userReplyIdsDataSchema } from '../../../utils/values/schemas'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'

export default class MarryNoAction extends CallbackButtonAction<UserReplyIdsData> {
    protected _schema: ZodType<UserReplyIdsData> = userReplyIdsDataSchema
    protected _buttonTitle?: string | undefined = "Свадьба: Нет"

    constructor() {
        super()
        this._name = 'marryno'
    }

    async execute({ctx, data, chatId}: CallbackButtonOptions<UserReplyIdsData>): Promise<string | void> {
        const {user: userId, reply: replyId} = data

        if(await ContextUtils.showAlertIfIdNotEqual(ctx, replyId)) return 

        await MessageUtils.editMarkup(ctx)
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/marriage/marry/no.pug',
            {
                changeValues: {
                    user: await ContextUtils.getUser(chatId, userId),
                    reply: await ContextUtils.getUser(chatId, replyId),
                }
            }
        )
    }
}