export default class Validator {
    static isEnvValueDefined(value: string | undefined): boolean {
        return typeof value == 'string'
    }
}