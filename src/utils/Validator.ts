export default class Validator {
    static isEnvVariableDefined(value?: string): boolean {
        return typeof value == 'string'
    }
}