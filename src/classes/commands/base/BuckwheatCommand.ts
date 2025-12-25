import RankUtils from '../../../utils/RankUtils'
import { BuckwheatCommandOptions } from '../../../utils/values/types/action-options'
import { CommandDescription } from '../../../utils/values/types/types'
import BaseAction from '../../actions/base/BaseAction'

export default abstract class BuckwheatCommand extends BaseAction {
    protected _description: string = ''
    protected _isShow: boolean = true
    protected _needData: boolean = false
    protected _replySupport: boolean = false
    protected _aliases: string[] = []
    protected _argumentText?: string
    protected _isPremium: boolean = false
    protected _minimumRank: number = RankUtils.min

    abstract execute(options: BuckwheatCommandOptions): Promise<void>

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
        }
    }

    async getRank(): Promise<number> {
        return this._minimumRank
    }

    get aliases(): string[] {
        return this._aliases
    }

    get isPremium(): boolean {
        return this._isPremium
    }
}