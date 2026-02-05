import { ZodType } from 'zod'
import DuelOfferData from '../../../interfaces/callback-button-data/DuelOfferData'
import CallbackButtonAction from '../CallbackButtonAction'
import { userReplyIdsDataSchema } from '../../../utils/values/schemas'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import DuelCheckService from '../../db/services/duel/DuelCheckService'
import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import LegacyInlineKeyboardManager from '../../main/LegacyInlineKeyboardManager'

export default class DuelYesAction extends CallbackButtonAction<DuelOfferData> {
    protected _buttonTitle?: string | undefined = "Дуэль: Да"
    protected _schema: ZodType<DuelOfferData> = userReplyIdsDataSchema

    constructor () {
        super()
        this._name = 'duelyes'
    }

    async execute(options: CallbackButtonOptions<DuelOfferData>): Promise<string | void> {
        const {
            data,
            ctx,
            chatId,
        } = options

        const {
            user: userId,
            reply: replyId
        } = data
        if (await ContextUtils.showAlertIfIdNotEqual(ctx, replyId)) return

        const checkOptionsPart = {
            chatId,
            ctx
        }

        if (!await DuelCheckService.checkAndSendMessage({ ...checkOptionsPart, id: userId })) return
        if (!await DuelCheckService.checkAndSendMessage({ ...checkOptionsPart, id: replyId })) return

        // await DuelistService.setField(chatId, userId, 'onDuel', true)
        // await DuelistService.setField(chatId, replyId, 'onDuel', true)

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/duel/fight/start.pug',
            {
                inlineKeyboard: await LegacyInlineKeyboardManager.get(
                    'duels/start',
                    {
                        userReply: JSON.stringify(data)
                    }
                )
            }
        )
    }
}