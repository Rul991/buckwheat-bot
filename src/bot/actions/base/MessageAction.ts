import type { MessageActionOptions } from "../../../types/action-options"
import type { ChatTypes } from "../../../types/unions"
import BaseAction from "./BaseAction"

export default abstract class MessageAction extends BaseAction {
    chatTypes: ChatTypes[] = ['chat', 'private']

    override name: string = this.constructor.name
    abstract override execute(options: MessageActionOptions): Promise<boolean | void>
}