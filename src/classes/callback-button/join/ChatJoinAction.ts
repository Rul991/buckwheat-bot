import { boolean, object, ZodType } from 'zod'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import CallbackButtonAction from '../CallbackButtonAction'
import { idSchema } from '../../../utils/values/schemas'
import RankUtils from '../../../utils/RankUtils'
import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'

type Data = {
    id: number
    approve: boolean
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> | null = idSchema
        .and(object({
            approve: boolean()
        }))

    constructor() {
        super()
        this._name = 'chatjoin'
        this._buttonTitle = 'Принятие заявок на вступление'
        this._minimumRank = RankUtils.moderator
    }

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            ctx,
            id: adminId,
            data,
            chatId
        } = options

        const {
            id: requestOwner,
            approve
        } = data

        if(approve) {
            await ContextUtils.approveChatJoinRequest(ctx, requestOwner)
        }
        else {
            await ContextUtils.declineChatJoinRequest(ctx, requestOwner)
        }

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/join/done.pug',
            {
                changeValues: {
                    approve,
                    admin: await ContextUtils.getUser(chatId, adminId),
                    user: await ContextUtils.getUser(chatId, requestOwner)
                }
            }
        )
        await MessageUtils.deleteMessage(ctx)
    }
}