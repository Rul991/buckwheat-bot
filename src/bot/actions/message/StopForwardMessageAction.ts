import type { MessageActionOptions } from "../../../types/action-options"
import MessageAction from "../base/MessageAction"

export default class StopForwardMessageAction extends MessageAction {
    override async execute(options: MessageActionOptions): Promise<boolean | void> {
        const {
            ctx
        } = options
        const msg = ctx.msg

        return !msg.forward_origin
    }
}