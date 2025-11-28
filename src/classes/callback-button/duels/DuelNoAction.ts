import { JSONSchemaType } from 'ajv'
import DuelOfferData from '../../../interfaces/callback-button-data/DuelOfferData'
import { CallbackButtonContext } from '../../../utils/values/types/types'
import CallbackButtonAction from '../CallbackButtonAction'
import { userReplyIdsDataSchema } from '../../../utils/values/schemas'
import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import DuelistService from '../../db/services/duelist/DuelistService'
import FileUtils from '../../../utils/FileUtils'

export default class DuelNoAction extends CallbackButtonAction<DuelOfferData> {
    protected _schema: JSONSchemaType<DuelOfferData> = userReplyIdsDataSchema

    constructor() {
        super()
        this._name = 'duelno'
    }

    async execute(ctx: CallbackButtonContext, data: DuelOfferData): Promise<string | void> {
        const { user, reply } = data
        const ids = [user, reply]
        const id = ctx.from.id

        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if(!chatId) return await FileUtils.readPugFromResource('text/actions/other/no-chat-id.pug')

        if(ids.includes(id)) {
            const isCreator = id == user
            const userLink = await ContextUtils.getUser(chatId, user)
            const replyLink = await ContextUtils.getUser(chatId, reply)

            await DuelistService.setField(chatId, user, 'onDuel', false)
            await MessageUtils.editMarkup(ctx, undefined)
            await MessageUtils.answerMessageFromResource(
                ctx,
                `text/commands/duel/no-offer/${isCreator ? 'creator-cancel' : 'reply-cancel'}.pug`,
                {
                    changeValues: {
                        user: userLink,
                        reply: replyLink
                    }
                }
            )
        }
        else {
            await ContextUtils.showAlertFromFile(ctx)
        }
    }

}