import { join } from 'path'
import FileUtils from '../../utils/FileUtils'
import { JsonButtonData, JsonButton, JsonKeyboard, Keyboard, ReplaceKeyboardData, Variables, Button } from '../../utils/values/types/keyboards'
import { MAX_BUTTONS_IN_HORISONTAL } from '../../utils/values/consts'
import ArrayUtils from '../../utils/ArrayUtils'

type HandleVariablesOptions = {
    variables: JsonKeyboard['variables']
    globals: ReplaceKeyboardData['globals']
}

type HandleDataOptions = {
    data: JsonButton['data']
    variables: Variables
}

type HandleDefinitionOptions = Required<Omit<ReplaceKeyboardData, 'maxWidth'>> & {
    definition: JsonKeyboard['definition']
    variables: Variables
}
type HandleDefinitionResult = Record<string, Button[]>

type HandleTextOptions = {
    text: JsonButton['text']
    globals: ReplaceKeyboardData['globals']
}

type HandleMarkupOptions = {
    markup: JsonKeyboard['markup']
    maxWidth: ReplaceKeyboardData['maxWidth'] & {}
    definition: HandleDefinitionResult
}

export default class {
    private static readonly _keyboardFolder = 'json/inline_keyboards/new/'
    private static readonly _keyboardExtension = 'json'

    private static _handleVariables({
        variables = {},
        globals = {}
    }: HandleVariablesOptions): Variables {
        const result = {} as Variables

        for (const variableName in variables) {
            const variable = variables[variableName]
            result[variableName] = {}

            for (const fieldName in variable) {
                const globalKey = variable[fieldName]
                const global = globals[globalKey]
                result[variableName][fieldName] = global
            }
        }

        return result
    }

    private static _handleData({
        data,
        variables = {}
    }: HandleDataOptions): JsonButtonData {
        let result = {
            ...data.$additional
        } as JsonButtonData

        for (const key of data.$vars ?? []) {
            const variable = variables[key]
            if (!variable) continue

            result = {
                ...result,
                ...variable
            }
        }

        return result
    }

    private static _handleText({
        text,
        globals
    }: HandleTextOptions) {
        if (typeof text == 'string') return text
        let result: string = ''

        for (const part of text) {
            if (part.startsWith('@')) {
                const key = part.slice(1)
                const global = globals?.[key]
                result += `${global ?? ''}`
            }
            else {
                result += part
            }
        }

        return result
    }

    private static _handleDefinition({
        definition,
        variables,
        globals,
        values
    }: HandleDefinitionOptions): HandleDefinitionResult {
        const result = {} as HandleDefinitionResult

        for (const key in definition) {
            const button = definition[key]
            const {
                text,
                data,
                name
            } = button

            const eachKey = data.$each
            const datas = eachKey ?
                values[eachKey] ?? [] :
                [{ text: '', data: {} }]

            const row = datas.map(v => {
                const handledData = this._handleData({
                    data,
                    variables
                })
                const newData = {
                    ...handledData,
                    ...v.data
                }

                const handledText = this._handleText({
                    text,
                    globals: {
                        ...globals,
                        '': v.text
                    }
                })

                return {
                    text: handledText,
                    callback_data: `${name}_${JSON.stringify(newData)}`
                }
            })

            if (row.length) {
                result[key] = row
            }
        }

        return result
    }

    private static _handleMarkup({
        markup,
        definition,
        maxWidth
    }: HandleMarkupOptions): Keyboard {
        const result: Keyboard = []

        for (const maybeRow of markup) {
            const isArray = maybeRow instanceof Array

            if (isArray) {
                const row = maybeRow.map(key => definition[key])

                for (const subRow of row) {
                    result.push(
                        ...ArrayUtils.objectsGrid({
                            objects: subRow,
                            width: maxWidth
                        })
                    )
                }
            }
            else {
                result.push(...definition[maybeRow].map(v => [v]))
            }
        }

        return result
    }

    static async get(filename: string, data: ReplaceKeyboardData = {}): Promise<Keyboard> {
        const jsonKeyboard = await FileUtils.readJsonFromResource<JsonKeyboard>(
            join(
                this._keyboardFolder,
                `${filename}.${this._keyboardExtension}`
            )
        )
        if (!jsonKeyboard) return []

        const {
            variables,
            definition,
            markup
        } = jsonKeyboard

        const {
            globals,
            values,
            maxWidth = MAX_BUTTONS_IN_HORISONTAL
        } = data

        const handledVariables = this._handleVariables({
            variables,
            globals
        })

        const handledDefinition = this._handleDefinition({
            definition,
            variables: handledVariables,
            values: values ?? {},
            globals: globals ?? {},
        })

        return this._handleMarkup({
            markup,
            definition: handledDefinition,
            maxWidth
        })
    }
}