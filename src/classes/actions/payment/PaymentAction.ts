import BaseAction from '../base/BaseAction'
import { PrecheckoutQueryOptions, SuccessfulPaymentOptions } from '../../../utils/values/types/action-options'

export default abstract class PaymentAction extends BaseAction {
    abstract precheckout(options: PrecheckoutQueryOptions): Promise<string | boolean>
    abstract execute(options: SuccessfulPaymentOptions): Promise<void>
}