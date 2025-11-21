import { JSONSchemaType } from 'ajv'
import UserReplyIdsData from '../../../interfaces/callback-button-data/UserReplyIdsData'
import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import { userReplyIdsDataSchema } from '../../../utils/values/schemas'
import { CallbackButtonContext } from '../../../utils/values/types'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import MarriageService from '../../db/services/marriage/MarriageService'
import CallbackButtonAction from '../CallbackButtonAction'
import FileUtils from '../../../utils/FileUtils'

export default class MarryYesAction extends CallbackButtonAction<UserReplyIdsData> {
    protected _schema: JSONSchemaType<UserReplyIdsData> = userReplyIdsDataSchema

    constructor() {
        super()
        this._name = 'marryyes'
    }

    async execute(ctx: CallbackButtonContext, data: UserReplyIdsData): Promise<string | void> {
        const {user: userId, reply: replyId} = data
        
        const chatId = await LinkedChatService.getCurrent(ctx, userId)
        if(!chatId) return await FileUtils.readPugFromResource('text/actions/other/no-chat-id.pug')

        if(await ContextUtils.showAlertIfIdNotEqual(ctx, replyId)) return 

        const replyHasPartner = await MarriageService.hasPartner(chatId, replyId)

        if(replyHasPartner) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/marriage/married/user.pug',
                {
                    changeValues: {
                        ...await ContextUtils.getUser(chatId, replyId)
                    }
                }
            )
            return
        }


        await MarriageService.marry(chatId, userId, replyId)
        await MessageUtils.editMarkup(ctx, undefined)
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/marriage/marry/yes.pug',
            {
                changeValues: {
                    reply: await ContextUtils.getUser(chatId, replyId),
                    user: await ContextUtils.getUser(chatId, userId),
                }
            }
        )
    }
}