export default class StartValidator {
    static isEnvVariableDefined(value?: string): boolean {
        return typeof value == 'string'
    }
}