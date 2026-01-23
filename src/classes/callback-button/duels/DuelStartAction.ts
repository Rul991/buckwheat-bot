import { number, object, ZodType } from 'zod'
import UserReplyIdsData from '../../../interfaces/callback-button-data/UserReplyIdsData'
import CallbackButtonAction from '../CallbackButtonAction'
import DuelService from '../../db/services/duel/DuelService'
import MessageUtils from '../../../utils/MessageUtils'
import ContextUtils from '../../../utils/ContextUtils'
import DuelUtils from '../../../utils/DuelUtils'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import { userReplyIdsDataSchema } from '../../../utils/values/schemas'

type Data = UserReplyIdsData & {
    bid?: number
}

export default class extends CallbackButtonAction<Data> {
    protected _buttonTitle?: string | undefined = "Дуэль: Старт"
    protected _schema: ZodType<Data> = userReplyIdsDataSchema
        .and(object({
            bid: number().optional()
        }))

    constructor () {
        super()
        this._name = 'duelstart'
    }

    async execute({ctx, data, chatId}: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            user,
            reply,
            bid
        } = data

        if (await ContextUtils.showAlertIfIdNotEqual(ctx, user)) return

        const duel = await DuelService.create({
            bidId: bid,
            firstDuelist: user,
            secondDuelist: reply,
            chatId
        })

        const { text, keyboard } = await DuelUtils.getParamsForFightMessage(chatId, duel)

        await MessageUtils.answer(
            ctx,
            text,
            {
                inlineKeyboard: keyboard
            }
        )
        await MessageUtils.deleteMessage(ctx)
    }
}