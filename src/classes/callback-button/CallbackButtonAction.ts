import { ZodType } from 'zod'
import Logging from '../../utils/Logging'
import ObjectValidator from '../../utils/ObjectValidator'
import { CallbackButtonOptions } from '../../utils/values/types/action-options'
import RankedAction from '../actions/base/RankedAction'
import { ActionAccess } from '../../utils/values/types/command-access'

export default abstract class CallbackButtonAction<T> extends RankedAction {
    protected abstract _schema: ZodType<T> | null
    protected _buttonTitle?: string
    protected _settingId: string = ''
    protected _canBeUseInPrivateWithoutRank: boolean = false

    get schema(): ZodType<T> | null {
        return this._schema
    }

    get canBeUseInPrivateWithoutRank(): boolean {
        return this._canBeUseInPrivateWithoutRank
    }

    get buttonTitle(): string | undefined {
        return this._buttonTitle
    }

    protected _isValid(data: T): data is T {
        if(!this._schema) return true
        return ObjectValidator.isValidatedObject<T>(data, this._schema)
    }

    protected _getData(raw: string): T {
        return raw
            .split('_')
            .reduce((prev, curr) => {
                return {...prev, ...JSON.parse(curr)}
            }, {}) as T
    }

    isValid(data: T | null): data is T {
        if(!data) return false

        return this._isValid(data)
    }

    getData(raw: string): T | null {
        try {
            return this._getData(raw)
        }
        catch(e) {
            Logging.error('Get data error:', e)
            return null
        }
    }

    get settingId(): string {
        return this._settingId || this._name
    }

    get actionAccesses(): ActionAccess[] {
        return this._buttonTitle ? [
            {
                name: this.settingId,
                setting: {
                    title: this._buttonTitle,
                    description: `Определяет минимальный ранг для кнопки ''${this._buttonTitle}''`,
                    type: 'enum',
                    default: this._minimumRank,
                    properties: {
                        values: [0, 1, 2, 3, 4, 5]
                    }
                }
            }
        ] : []
    }

    abstract execute(options: CallbackButtonOptions<T>): Promise<string | void>
}