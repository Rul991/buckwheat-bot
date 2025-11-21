import { PreCheckoutQuery, SuccessfulPayment } from 'telegraf/types'
import { PreCheckoutQueryContext, SuccessfulPaymentContext } from '../../../utils/values/types'
import PaymentAction from './PaymentAction'
import { FIRST_INDEX, MILLISECONDS_IN_MONTH, PREMIUM_PRICE_PER_MONTH } from '../../../utils/values/consts'
import PremiumChatService from '../../db/services/chat/PremiumChatService'
import MessageUtils from '../../../utils/MessageUtils'
import ContextUtils from '../../../utils/ContextUtils'
import FileUtils from '../../../utils/FileUtils'

export default class SubscriptionAction extends PaymentAction {
    constructor() {
        super()
        this._name = 'sub'
    }

    private _getValues(payload: string): [string, number, number] {
        const values = payload.split('_', 3)

        return [
            values[FIRST_INDEX],
            +values[1],
            +values[2],
        ]
    }

    private _isPrecheckout(payload: string, price: number): boolean {
        const [_, months] = this._getValues(payload)

        return PREMIUM_PRICE_PER_MONTH * months == price
    }

    async precheckout(_ctx: PreCheckoutQueryContext, {invoice_payload, total_amount}: PreCheckoutQuery): Promise<string | boolean> {
        const isPrecheckout = this._isPrecheckout(invoice_payload, total_amount)
        return isPrecheckout ? true : await FileUtils.readPugFromResource('text/precheckout/old-price.pug')
    }
    
    async execute(ctx: SuccessfulPaymentContext, payment: SuccessfulPayment): Promise<void> {
        const [_, months, chatId] = this._getValues(payment.invoice_payload)

        await PremiumChatService.add(chatId, months * MILLISECONDS_IN_MONTH)
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/premium/bought.pug',
            {
                changeValues: {
                    ...await ContextUtils.getUser(chatId, ctx.from.id),
                    months,
                },
                chatId,
                isReply: false
            }
        )
    }
}