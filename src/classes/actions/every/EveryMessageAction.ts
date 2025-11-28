import BaseAction from '../base/BaseAction'
import { MessageContext } from '../../../utils/values/types/types'

export default abstract class EveryMessageAction extends BaseAction {
    protected _canUsePrivate: boolean = false

    abstract execute(ctx: MessageContext): Promise<void | true>

    get canUsePrivate(): boolean {
        return this._canUsePrivate
    }
}