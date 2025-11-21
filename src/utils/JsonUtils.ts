import Logging from './Logging'

export default class JsonUtils {
    static parse<T>(text: string): T | null {
        try {
            return JSON.parse(text)
        }
        catch(e) {
            Logging.warn(`Cant read json: ${text}: ${e}`)
            return null
        }
    }
}