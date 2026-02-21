import BaseAction from '../base/BaseAction'
import { EveryMessageOptions } from '../../../utils/values/types/action-options'

export default abstract class EveryMessageAction extends BaseAction {
    protected _canUsePrivate: boolean = false

    abstract execute(options: EveryMessageOptions): Promise<void | true>

    get canUsePrivate(): boolean {
        return this._canUsePrivate
    }
}