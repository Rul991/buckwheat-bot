import type { MyBot } from "../../../types/bot"
import type { PreCheckoutQueryContext, SuccessfulPaymentMessageContext } from "../../../types/contexts"
import type { PreCheckoutResult, SuccessfulPaymentResult } from "../../../types/results"
import ContextUtils from "../../../utils/bot/ContextUtils"
import MessageUtils from "../../../utils/bot/MessageUtils"
import PayloadConverter from "../../../utils/payload/PayloadConverter"
import type PaymentAction from "../../actions/base/PaymentAction"
import BaseHandler from "../base/BaseHandler"

type ConvertPayloadResult<T> =
    | {
        ok: false
        key: string
    }
    | {
        ok: true,
        data: T
        action: PaymentAction<T>
    }

export default class PaymentHandler extends BaseHandler<PaymentAction<any>> {
    private _convertPayloadToData<T = any>(payload: string): ConvertPayloadResult<T> {
        const splitEncodedData = PayloadConverter.splitEncoded(payload)
        if (!splitEncodedData) return {
            ok: false,
            key: 'payment/system/wrong-data-format'
        } as const

        const [name, rawData] = splitEncodedData
        const action = this._container.get(name)
        if (!action) return {
            ok: false,
            key: 'payment/system/no-action'
        } as const

        const data = PayloadConverter.decode({
            schema: action.schema,
            data: rawData
        })
        if (!data) return {
            ok: false,
            key: 'payment/system/wrong-data'
        } as const

        return {
            ok: true,
            data,
            action
        } as const
    }

    private async _handlePreCheckout(ctx: PreCheckoutQueryContext): Promise<PreCheckoutResult> {
        try {
            const id = ctx.vars.id
            const query = ctx.preCheckoutQuery
            const payload = query.invoice_payload
            const convertPayloadResult = this._convertPayloadToData(payload)

            if (!convertPayloadResult.ok) {
                return convertPayloadResult
            }

            const {
                action,
                data
            } = convertPayloadResult

            return await action.preCheckout({
                id,
                ctx,
                data,
                query: ctx.preCheckoutQuery
            })
        }
        catch (e) {
            return {
                ok: false,
                key: 'payment/system/error',
                vars: {
                    error: e
                }
            }
        }
    }

    private async _handleSuccessfulPayment(ctx: SuccessfulPaymentMessageContext): Promise<SuccessfulPaymentResult> {
        try {
            const id = ctx.vars.id
            const chatId = ctx.vars.chatId
            if (!chatId) return {
                key: 'payment/system/no-chat-id'
            }

            const payment = ctx.msg.successful_payment
            const payload = payment.invoice_payload
            const convertPayloadResult = this._convertPayloadToData(payload)

            if (!convertPayloadResult.ok) {
                return convertPayloadResult
            }

            const {
                action,
                data
            } = convertPayloadResult

            return await action.execute({
                payment,
                chatId,
                data,
                ctx,
                id,
            })
        }
        catch (e) {
            return {
                key: 'payment/system/error',
                options: {
                    vars: {
                        error: e
                    }
                }
            }
        }
    }

    override async setup(bot: MyBot): Promise<void> {
        bot.on(
            'pre_checkout_query',
            async ctx => {
                const result = await this._handlePreCheckout(ctx)
                await ContextUtils.answerPreCheckoutQuery(
                    ctx,
                    result
                )
            }
        )

        bot.on(
            'msg:successful_payment',
            async ctx => {
                const result = await this._handleSuccessfulPayment(ctx)
                if (!result) return

                await MessageUtils.reply(
                    ctx,
                    result.key,
                    result.options
                )
            }
        )
    }
}