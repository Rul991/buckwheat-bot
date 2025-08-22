import BaseAction from '../base/BaseAction'
import { MessageContext } from '../../../utils/values/types'

export default abstract class EveryMessageAction extends BaseAction {
    abstract execute(ctx: MessageContext): Promise<void | true>
}