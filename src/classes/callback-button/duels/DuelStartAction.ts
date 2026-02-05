import { ZodType } from 'zod'
import UserReplyIdsData from '../../../interfaces/callback-button-data/UserReplyIdsData'
import CallbackButtonAction from '../CallbackButtonAction'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import { userReplyIdsDataSchema } from '../../../utils/values/schemas'

type Data = UserReplyIdsData
export default class extends CallbackButtonAction<Data> {
    protected _buttonTitle?: string | undefined = "Дуэль: Старт"
    protected _schema: ZodType<Data> = userReplyIdsDataSchema

    constructor () {
        super()
        this._name = 'duelstart'
    }

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            ctx, 
            data, 
            chatId
        } = options

        const {
            reply: replyId,
            user: userId,
        } = data
    }
}