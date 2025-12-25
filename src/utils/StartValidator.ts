import { env } from 'process'

type EnvVariable = { name: string, isMustDefined: boolean }

export default class StartValidator {
    static isEnvVariableDefined(value?: string): boolean {
        return typeof value == 'string'
    }

    static createVariable(name: string, isMustDefined = true): EnvVariable {
        return {
            name, 
            isMustDefined
        }
    }

    static validate(variables: EnvVariable[]) {
        for (const variable of variables) {
            const {
                name,
                isMustDefined
            } = variable

            if (!this.isEnvVariableDefined(env[name])) {
                const message = `undefined ${name}`

                if (!isMustDefined) {
                    console.warn(message)
                }
                else {
                    throw new Error(message)
                }
            }
        }
    }
}