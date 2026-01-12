import Logging from './Logging'
import JsonUtils from './JsonUtils'
import { ZodType } from 'zod'

export default class ObjectValidator {
    static isValidatedObject<T>(obj: T | any, schema: ZodType<T>): obj is T {
        const parsed = schema.safeParse(obj)

        if(!parsed.success) {
            Logging.error(
                '[VALIDATION ERROR]',
                parsed.error
            )
        }

        return parsed.success
    }

    static isValidatedJson<T>(data: string, schema: ZodType<T>): boolean {
        const json = JsonUtils.parse<T>(data)
        if(!json) return false

        return this.isValidatedObject(json, schema)
    }
}