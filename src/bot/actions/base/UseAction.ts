import type { BotUseActionOptions } from "../../../types/action-options"
import BaseAction from "./BaseAction"

export default abstract class BotUseAction extends BaseAction {
    override name: string = this.constructor.name
    abstract override execute(options: BotUseActionOptions): Promise<boolean | void>
}