import { CommandDescription } from '../../../utils/values/types/types'
import BaseAction from './BaseAction'

export default abstract class extends BaseAction {
    protected _description: string = ''
    protected _isShow: boolean = true
    protected _needData: boolean = false
    protected _replySupport: boolean = false
    protected _aliases: string[] = []
    protected _argumentText?: string
    protected _isPremium: boolean = false

    get commandDescription(): CommandDescription {
        return {
            name: this._name,
            description: this._description,
            isShow: this._isShow,
            needData: this._needData,
            replySupport: this._replySupport,
            argumentText: this._argumentText,
            aliases: this._aliases,
            isPremium: this._isPremium,
            minimumRank: this._minimumRank,
            type: this.descriptionType,
            typeName: this.typeName
        }
    }

    get aliases(): string[] {
        return this._aliases
    }

    get isPremium(): boolean {
        return this._isPremium
    }

    abstract get descriptionType(): string
    abstract get typeName(): string
}