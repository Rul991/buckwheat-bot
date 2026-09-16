import type { NewChatMemberActionOptions } from "../../../types/action-options"
import BaseAction from "./BaseAction"

export default abstract class NewChatMemberAction extends BaseAction {
    override name: string = this.constructor.name
    abstract override execute(options: NewChatMemberActionOptions): Promise<void>
}