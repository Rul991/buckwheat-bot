import { ActionAccess } from '../../../utils/values/types/command-access'
import BaseAction from './BaseAction'

export default abstract class extends BaseAction {
    protected _minimumRank: number = 0
    protected _canBeChanged: boolean = true

    get minimumRank(): number {
        return this._minimumRank
    }

    abstract get actionAccesses(): ActionAccess[]
}