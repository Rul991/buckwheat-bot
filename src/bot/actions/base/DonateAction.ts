import type { Message } from "@bufbuild/protobuf"
import BaseAction from "./BaseAction"
import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import type { PreCheckoutQueryOptions, ShippingQueryOptions } from "../../../types/action-options"
import type { PreCheckoutResult } from "../../../types/results"

export default abstract class DonateAction<T> extends BaseAction {
    abstract schema: GenMessage<T & Message<any>>

    abstract preCheckout(options: PreCheckoutQueryOptions<T>): Promise<PreCheckoutResult>
    abstract override execute(options: ShippingQueryOptions<T>): Promise<DonateResult>
}