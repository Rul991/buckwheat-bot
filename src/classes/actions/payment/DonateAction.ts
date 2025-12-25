import { PreCheckoutQuery, SuccessfulPayment } from 'telegraf/types'
import { SuccessfulPaymentContext } from '../../../utils/values/types/contexts'
import { PreCheckoutQueryContext } from '../../../utils/values/types/contexts'
import PaymentAction from './PaymentAction'
import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import { STAR_TO_COIN } from '../../../utils/values/consts'
import CasinoAddService from '../../db/services/casino/CasinoAddService'
import StringUtils from '../../../utils/StringUtils'
import FileUtils from '../../../utils/FileUtils'
import { PrecheckoutQueryOptions, SuccessfulPaymentOptions } from '../../../utils/values/types/action-options'

export default class DonateAction extends PaymentAction {
    constructor () {
        super()
        this._name = 'donate'
    }

    async precheckout({ query: payment }: PrecheckoutQueryOptions): Promise<string | boolean> {
        const chatId = +payment.invoice_payload.split('_')[1]
        return typeof chatId == 'number' ? true : await FileUtils.readPugFromResource('text/actions/other/no-chat-id.pug')
    }

    async execute({
        ctx, 
        payment
    }: SuccessfulPaymentOptions): Promise<void> {
        const id = ctx.from.id
        const chatId = +payment.invoice_payload.split('_')[1]

        const stars = payment.total_amount
        const coins = Math.ceil(stars * STAR_TO_COIN)

        await CasinoAddService.money(chatId, id, coins)
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/donate/done.pug',
            {
                changeValues: {
                    ...await ContextUtils.getUser(chatId, id),
                    coins,
                    rubles: StringUtils.toFormattedNumber(stars)
                },
                chatId,
                isReply: false
            }
        )
    }

}