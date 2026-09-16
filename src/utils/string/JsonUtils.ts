import ExceptionUtils from "../exceptions/ExceptionUtils"

export default class JsonUtils {
    static stringify(value: any, space?: number): string {
        return ExceptionUtils.handle(
            () => {
                return JSON.stringify(
                    value,
                    (key, value) => {
                        if(key == '$typeName') return undefined
                        if(typeof value == 'bigint') return Number(value)

                        return value
                    },
                    space
                )
            },
            '{"error":\"exception\"}'
        )
    }
}