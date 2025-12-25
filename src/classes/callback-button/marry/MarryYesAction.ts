import { JSONSchemaType } from 'ajv'
import UserReplyIdsData from '../../../interfaces/callback-button-data/UserReplyIdsData'
import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import { userReplyIdsDataSchema } from '../../../utils/values/schemas'
import { CallbackButtonContext } from '../../../utils/values/types/contexts'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import MarriageService from '../../db/services/marriage/MarriageService'
import CallbackButtonAction from '../CallbackButtonAction'
import FileUtils from '../../../utils/FileUtils'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'

export default class MarryYesAction extends CallbackButtonAction<UserReplyIdsData> {
    protected _schema: JSONSchemaType<UserReplyIdsData> = userReplyIdsDataSchema

    constructor() {
        super()
        this._name = 'marryyes'
    }

    async execute({ctx, data, chatId}: CallbackButtonOptions<UserReplyIdsData>): Promise<string | void> {
        const {user: userId, reply: replyId} = data
        
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