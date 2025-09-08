import type { AnyRecord, PrimitiveJavascriptTypes, SchemaObject } from './values/types'

export default class ObjectValidator {
    static isArray(arr: any): boolean {
        return arr instanceof Array
    }

    static isObject(obj: any): boolean {
        return typeof obj == 'object' && !this.isArray(obj) && obj !== null
    }

    static isValidatedObject<T extends AnyRecord>(obj: T, schema: SchemaObject<T>): boolean {
        for (const key of Object.keys(schema)) {
            const value = schema[key]
            const valueArray = value instanceof Array ? value : [value]

            for (const type of valueArray) {
                if(type == 'any') continue
                
                let errorCounts = 0
                
                if(typeof type == typeof obj[key] && typeof type == 'object') {
                    errorCounts = +!this.isValidatedObject(obj[key], type)
                }
                else if(type == 'array' && this.isArray(obj[key])) {}
                else if(type != typeof obj[key]) {
                    errorCounts++
                }
                else if(type == 'object' && obj[key] === null) {
                    errorCounts++
                }

                if(errorCounts >= valueArray.length) return false
            }

        }

        return true
    }

    static isArrayWithObjects<T extends AnyRecord>(arr: any[], schema: SchemaObject<T>): boolean {
        if(!this.isArray(arr)) return false
        if(!arr.length) return true

        for (const object of arr) {
            if(!this.isValidatedObject(object, schema)) return false
        }

        return true
    }
}