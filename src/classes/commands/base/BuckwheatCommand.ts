import { CommandDescription, MaybeString, TextContext } from '../../../utils/values/types'
import BaseAction from '../../actions/base/BaseAction'

export default abstract class BuckwheatCommand extends BaseAction {
    protected _description: string = ''
    protected _isShow: boolean = true
    protected _needData: boolean = false
    protected _replySupport: boolean = false
    protected _argumentText?: string

    abstract execute(ctx: TextContext, other: MaybeString): Promise<void>

    get commandDescription(): CommandDescription {
        return {
            name: this._name,
            description: this._description,
            isShow: this._isShow,
            needData: this._needData,
            replySupport: this._replySupport,
            argumentText: this._argumentText
        }
    }
}