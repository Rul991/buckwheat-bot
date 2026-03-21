import Logging from './Logging'

export default class JsonUtils {
    static parse<T>(text: string): T | null {
        try {
            return JSON.parse(text)
        }
        catch (e) {
            Logging.warn(`Cant read json: ${text}: ${e}`)
            return null
        }
    }

    static stringify(value: any, tabs?: string | number): string {
        try {
            return JSON.stringify(
                value,
                null,
                tabs
            )
        }
        catch(e) {
            Logging.error('stringify json error:', e)
            return '{}'
        }
    }
}