import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { DonatePaymentDataSchema, type DonatePaymentData } from "../../../protos/payment_pb"
import type { PreCheckoutQueryOptions, SuccesfulPaymentOptions } from "../../../types/action-options"
import type { PreCheckoutResult, SuccessfulPaymentResult } from "../../../types/results"
import PaymentAction from "../base/PaymentAction"
import PaymentUtils from "../../../utils/payment/PaymentUtils"
import BalanceService from "../../../db/services/money/BalanceService"

class DonatePaymentAction extends PaymentAction<DonatePaymentData> {
    override schema: GenMessage<DonatePaymentData> = DonatePaymentDataSchema
    override name: string = 'donate'

    override async preCheckout(_options: PreCheckoutQueryOptions<DonatePaymentData>): Promise<PreCheckoutResult> {
        return {
            ok: true
        }
    }

    override async execute(options: SuccesfulPaymentOptions<DonatePaymentData>): Promise<SuccessfulPaymentResult> {
        const {
            payment,
            id,
            ctx,
            data
        } = options

        const stars = payment.total_amount
        const money = PaymentUtils.getMoneyByStars(stars)
        const user = await ctx.vars.user.get()
        const chatId = Number(data.chatId)

        await BalanceService.add({
            chatId,
            id,
            money
        })

        return {
            key: 'donate/donate',
            options: {
                vars: {
                    stars,
                    money,
                    user
                },
                chatId
            }
        }
    }
}

export default new DonatePaymentAction()