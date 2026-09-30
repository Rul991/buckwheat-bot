import type { Message } from "@bufbuild/protobuf"
import BaseAction from "./BaseAction"
import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import type { PreCheckoutQueryOptions, SuccesfulPaymentOptions } from "../../../types/action-options"
import type { PreCheckoutResult, SuccessfulPaymentResult } from "../../../types/results"
import type { BotContext } from "../../../types/bot"
import MessageUtils from "../../../utils/bot/MessageUtils"
import type { InvoiceOptions } from "../../../types/options"
import PayloadConverter from "../../../utils/payload/PayloadConverter"

type InvoiceMethodOptions<T> = 
    & Omit<InvoiceOptions, 'payload'>
    & {
        data: Omit<T, '$typeName'>
    }

export default abstract class PaymentAction<T> extends BaseAction {
    abstract schema: GenMessage<T & Message<any>>

    abstract preCheckout(options: PreCheckoutQueryOptions<T>): Promise<PreCheckoutResult>
    abstract override execute(options: SuccesfulPaymentOptions<T>): Promise<SuccessfulPaymentResult>

    async invoice(ctx: BotContext, options: InvoiceMethodOptions<T>) {
        return await MessageUtils.replyInvoice(
            ctx,
            this.name,
            {
                ...options,
                payload: PayloadConverter.encode({
                    name: this.name,
                    schema: this.schema,
                    data: {
                        ...options.data,
                        $typeName: this.schema.typeName
                    }
                })
            }
        )
    }
}