import { ZodType } from 'zod'
import DuelOfferData from '../../../interfaces/callback-button-data/DuelOfferData'
import CallbackButtonAction from '../CallbackButtonAction'
import { userReplyIdsDataSchema } from '../../../utils/values/schemas'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import DuelCheckService from '../../db/services/duel/DuelCheckService'
import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import DuelistService from '../../db/services/duelist/DuelistService'
import DuelService from '../../db/services/duel/DuelService'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import Logging from '../../../utils/Logging'

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

        if (true) {
            await DuelistService.setField(chatId, userId, 'onDuel', true)
            await DuelistService.setField(chatId, replyId, 'onDuel', true)
        }

        const duel = await DuelService.start({
            chatId,
            firstDuelist: userId,
            secondDuelist: replyId,
        })
        const {
            id: duelId
        } = duel
        Logging.log({
            duel
        })

        await MessageUtils.editMarkup(ctx)
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/duel/fight/start.pug',
            {
                changeValues: {
                    user: await ContextUtils.getUser(chatId, userId),
                    reply: await ContextUtils.getUser(chatId, replyId),
                },
                inlineKeyboard: await InlineKeyboardManager.get(
                    'duels/start',
                    {
                        globals: {
                            duelId
                        }
                    }
                )
            }
        )
    }
}