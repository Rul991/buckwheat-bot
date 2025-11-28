import { JSONSchemaType } from 'ajv'
import UserReplyIdsData from '../../../interfaces/callback-button-data/UserReplyIdsData'
import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import { CallbackButtonContext } from '../../../utils/values/types/types'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import CallbackButtonAction from '../CallbackButtonAction'
import { userReplyIdsDataSchema } from '../../../utils/values/schemas'
import FileUtils from '../../../utils/FileUtils'

export default class MarryNoAction extends CallbackButtonAction<UserReplyIdsData> {
    protected _schema: JSONSchemaType<UserReplyIdsData> = userReplyIdsDataSchema

    constructor() {
        super()
        this._name = 'marryno'
    }

    async execute(ctx: CallbackButtonContext, data: UserReplyIdsData): Promise<string | void> {
        const {user: userId, reply: replyId} = data
        const chatId = await LinkedChatService.getCurrent(ctx, userId)
        if(!chatId) return await FileUtils.readPugFromResource('text/actions/other/no-chat-id.pug')

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