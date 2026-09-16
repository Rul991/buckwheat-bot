import type { ConditionalCommandOptions } from "../../../types/action-options"
import BaseAction from "./BaseAction"

export default abstract class ConditionalCommand extends BaseAction {
    override name: string = this.constructor.name
    abstract condition(options: ConditionalCommandOptions): Promise<boolean>
    abstract override execute(options: ConditionalCommandOptions): Promise<boolean | void>
}