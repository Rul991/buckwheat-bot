import Logger from "../logs/Logger"

export default class ExceptionUtils {
    static handle<T, D = undefined>(callback: () => T, defaultValue: D = undefined as D) {
        try {
            return callback()
        }
        catch(e) {
            Logger.error('ExceptionUtils.handle', e)
            return defaultValue
        }
    }

    static async handleAsync<T, D = undefined>(callback: () => Promise<T>, defaultValue: D = undefined as D): Promise<T | D> {
        try {
            return await callback()
        }
        catch(e) {
            Logger.error('ExceptionUtils.handleAsync', e)
            return defaultValue
        }
    }
}