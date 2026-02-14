import { RANKS_LIST } from '../../../utils/values/consts'
import { ActionAccess } from '../../../utils/values/types/command-access'
import { CommandDescription } from '../../../utils/values/types/types'
import RankedAction from './RankedAction'

export default abstract class extends RankedAction {
    protected _description: string = ''
    protected _isShow: boolean = true
    protected _needData: boolean = false
    protected _replySupport: boolean = false
    protected _aliases: string[] = []
    protected _argumentText?: string
    protected _isPremium: boolean = false
    protected abstract _settingId: string

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
            minimumRank: this.minimumRank,
            type: this.descriptionType,
            typeName: this.typeName
        }
    }

    get actionAccesses(): ActionAccess[] {
        return this._isShow ? [
            {
                setting: {
                    title: `Баквит ${this._name}`,
                    description: `Определяет ранг команды ''баквит ${this._name}'' типа ${this.typeName}`,
                    type: 'enum',
                    default: this._minimumRank,
                    properties: {
                        values: this._canBeChanged ? 
                            RANKS_LIST :
                            []
                    }
                },
                name: this._settingId
            }
        ] : []
    }

    get aliases(): string[] {
        return this._aliases
    }

    get isPremium(): boolean {
        return this._isPremium
    }

    get settingId(): string {
        return this._settingId
    }

    abstract get descriptionType(): string
    abstract get typeName(): string
}