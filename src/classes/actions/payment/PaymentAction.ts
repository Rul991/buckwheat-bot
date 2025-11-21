import BaseAction from '../base/BaseAction'
import { PreCheckoutQueryContext, SuccessfulPaymentContext } from '../../../utils/values/types'
import { PreCheckoutQuery, SuccessfulPayment } from 'telegraf/types'

export default abstract class PaymentAction extends BaseAction {
    abstract precheckout(ctx: PreCheckoutQueryContext, query: PreCheckoutQuery): Promise<string | boolean>
    abstract execute(ctx: SuccessfulPaymentContext, payment: SuccessfulPayment): Promise<void>
}