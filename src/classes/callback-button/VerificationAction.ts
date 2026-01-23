import { number, ZodType } from 'zod'
import AdminUtils from '../../utils/AdminUtils'
import ContextUtils from '../../utils/ContextUtils'
import MessageUtils from '../../utils/MessageUtils'
import { CallbackButtonContext } from '../../utils/values/types/contexts'
import UserOldService from '../db/services/user/UserOldService'
import CallbackButtonAction from './CallbackButtonAction'
import UserRankService from '../db/services/user/UserRankService'
import RankUtils from '../../utils/RankUtils'
import { CallbackButtonOptions } from '../../utils/values/types/action-options'

type Data = number

export default class VerificationAction extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = number()
    protected _buttonTitle: string = 'Верификация'

    constructor () {
        super()
        this._name = 'verify'
    }

    protected _getData(raw: string): Data {
        return +raw
    }

    private static async _sendHelloMessage(
        ctx: CallbackButtonContext,
        chatId: number,
        id: number
    ) {
        await MessageUtils.answerMessageFromResource(
            ctx,
            `text/commands/hello/verify/yes.pug`,
            {
                changeValues: await ContextUtils.getUser(chatId, id)
            }
        )
    }

    async execute({ ctx, data: dataId, chatId, id }: CallbackButtonOptions<Data>): Promise<string | void> {
        const isCan = id == dataId ||
            await UserRankService.get(chatId, id) >= RankUtils.moderator

        if (isCan) {
            await UserOldService.update(chatId, dataId, true)
            await AdminUtils.unmute(ctx, dataId)
            await VerificationAction._sendHelloMessage(ctx, chatId, dataId)
            await MessageUtils.editMarkup(ctx, undefined)
        }
        else {
            await ContextUtils.showCallbackMessageFromFile(ctx)
        }
    }
}