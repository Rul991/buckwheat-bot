import { JSONSchemaType } from 'ajv'
import DuelOfferData from '../../../interfaces/callback-button-data/DuelOfferData'
import { CallbackButtonContext } from '../../../utils/values/types'
import CallbackButtonAction from '../CallbackButtonAction'
import { userReplyIdsDataSchema } from '../../../utils/values/schemas'
import MessageUtils from '../../../utils/MessageUtils'
import ContextUtils from '../../../utils/ContextUtils'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import DuelUtils from '../../../utils/DuelUtils'
import DuelistService from '../../db/services/duelist/DuelistService'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import FileUtils from '../../../utils/FileUtils'
import CasinoAddService from '../../db/services/casino/CasinoAddService'
import DuelService from '../../db/services/duel/DuelService'

export default class DuelYesAction extends CallbackButtonAction<DuelOfferData> {
    protected _schema: JSONSchemaType<DuelOfferData> = userReplyIdsDataSchema

    constructor() {
        super()
        this._name = 'duelyes'
    }

    async execute(ctx: CallbackButtonContext, data: DuelOfferData): Promise<string | void> {
        const { user: userId, reply: replyId } = data

        const chatId = await LinkedChatService.getCurrent(ctx, replyId)
        if(!chatId) return await FileUtils.readPugFromResource('text/actions/other/no-chat-id.pug')

        if(await ContextUtils.showAlertIfIdNotEqual(ctx, replyId)) return 
        if(!await DuelUtils.checkStatsAndSendMessage({chatId, ctx, userId, replyId, isUserFirst: false})) return
        if(!await DuelUtils.checkStatsAndSendMessage({chatId, ctx, userId: replyId, replyId: userId, isUserFirst: true})) return

        const {price: userPrice} = await DuelService.getPriceStats(chatId, userId)
        const {price: replyPrice} = await DuelService.getPriceStats(chatId, replyId)

        await CasinoAddService.money(chatId, userId, -userPrice)
        await CasinoAddService.money(chatId, replyId, -replyPrice)

        await DuelistService.setField(chatId, replyId, 'onDuel', true)
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/duel/bid/choose.pug',
            {
                inlineKeyboard: await InlineKeyboardManager.get(
                    'duels/start',
                    JSON.stringify({
                        user: userId,
                        reply: replyId
                    })
                ),
                changeValues: {
                    ...await ContextUtils.getUser(chatId, userId)
                }
            }
        )
        await MessageUtils.deleteMessage(ctx)
    }

}