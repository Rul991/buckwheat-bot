import BaseAction from '../actions/base/BaseAction'
import { JSONSchemaType } from 'ajv'
import Logging from '../../utils/Logging'
import ObjectValidator from '../../utils/ObjectValidator'
import { CallbackButtonOptions } from '../../utils/values/types/action-options'

export default abstract class CallbackButtonAction<T> extends BaseAction {
    protected abstract _schema: JSONSchemaType<T> | null

    get schema(): JSONSchemaType<T> | null {
        return this._schema
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

    abstract execute(options: CallbackButtonOptions<T>): Promise<string | void>
}