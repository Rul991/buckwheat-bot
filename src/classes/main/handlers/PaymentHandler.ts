import PaymentAction from '../../actions/payment/PaymentAction'
import BaseHandler from './BaseHandler'
import { MyTelegraf } from '../../../utils/values/types/types'
import { SuccessfulPaymentContext } from '../../../utils/values/types/contexts'
import { PreCheckoutQueryContext } from '../../../utils/values/types/contexts'
import ContextUtils from '../../../utils/ContextUtils'

export default class PaymentHandler extends BaseHandler<PaymentAction, Record<string, PaymentAction>, typeof PaymentAction> {
    constructor() {
        super({}, PaymentAction)
    }

    private _searchAction(ctx: PreCheckoutQueryContext | SuccessfulPaymentContext): PaymentAction | null {
        if(!(ctx.message?.successful_payment.invoice_payload || ctx.preCheckoutQuery?.invoice_payload)) 
            return null

        const invoicePayload = (ctx.message?.successful_payment.invoice_payload || ctx.preCheckoutQuery?.invoice_payload)!

        for (const key in this._container) {
            if(invoicePayload.startsWith(`${key}`)) {
                return this._container[key]
            }
        }

        return null
    }

    setup(bot: MyTelegraf): void {
        bot.on('pre_checkout_query', async ctx => {
            const action = this._searchAction(ctx)
            
            if(!action) {
                await ContextUtils.answerPrecheckoutFromResource(
                    ctx, 
                    false, 
                    'text/precheckout/hasnt.pug'
                )
                return
            }
            
            const query = ctx.preCheckoutQuery
            const result = await action.precheckout({
                ctx,
                query
            })

            if(typeof result == 'string') {
                await ContextUtils.answerPrecheckout(ctx, false, result)
            }
            else {
                await ContextUtils.answerPrecheckout(ctx, result)
            }
        })

        bot.on('successful_payment', async ctx => {
            const action = this._searchAction(ctx)

            if(!action) {
                return
            }

            const payment = ctx.message.successful_payment
            await action.execute({
                ctx,
                payment
            })
        })
    }
}