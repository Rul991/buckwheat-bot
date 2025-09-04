import Logging from './Logging'
import { AsyncOrSync } from './values/types'

export default class ExceptionUtils {
    static async handle(callback: () => AsyncOrSync): Promise<boolean> {
        try {
            await callback()
            return true
        }
        catch(e) {
            Logging.error(e)
            return false
        }
    }
}