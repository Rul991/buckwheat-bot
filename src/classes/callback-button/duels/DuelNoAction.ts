import { ZodType } from 'zod'
import DuelOfferData from '../../../interfaces/callback-button-data/DuelOfferData'
import { CallbackButtonContext } from '../../../utils/values/types/contexts'
import CallbackButtonAction from '../CallbackButtonAction'
import { userReplyIdsDataSchema } from '../../../utils/values/schemas'
import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import DuelistService from '../../db/services/duelist/DuelistService'
import FileUtils from '../../../utils/FileUtils'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'

export default class DuelNoAction extends CallbackButtonAction<DuelOfferData> {
    protected _schema: ZodType<DuelOfferData> = userReplyIdsDataSchema
    protected _buttonTitle?: string | undefined = "Дуэль: Нет"

    constructor() {
        super()
        this._name = 'duelno'
    }

    async execute({ctx, data, chatId}: CallbackButtonOptions<DuelOfferData>): Promise<string | void> {
        const { user, reply } = data
        const ids = [user, reply]
        const id = ctx.from.id

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