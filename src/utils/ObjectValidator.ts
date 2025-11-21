import Ajv, { JSONSchemaType } from 'ajv/dist/2020'
import Logging from './Logging'

export default class ObjectValidator {
    private static _ajv: Ajv = new Ajv({
        allowUnionTypes: true, 
        allErrors: true, 
        verbose: true, 
        strict: true,
        strictNumbers: true,
        strictRequired: true,
        strictSchema: true,
        strictTuples: true,
        strictTypes: true
    })

    static isValidatedObject<T>(obj: T | any, schema: JSONSchemaType<T>): obj is T {
        try {
            const validator = this._ajv.compile<T>(schema)
            const isValid = validator(obj)

            if(validator.errors) {
                Logging.error('[Cant be validated]', obj)
            }

            validator.errors?.forEach(error => {
                Logging.error('[Validation Error]', error)
            })

            return isValid
        }
        catch(e) {
            Logging.error('[Validation exception]', e)
            return false
        }
    }
}