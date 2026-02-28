import { join } from 'path'
import FileUtils from '../../utils/FileUtils'
import { JsonButtonData, JsonButton, JsonKeyboard, Keyboard, ReplaceKeyboardData, Variables, Button } from '../../utils/values/types/keyboards'
import { MAX_BUTTONS_IN_HORISONTAL } from '../../utils/values/consts'
import ArrayUtils from '../../utils/ArrayUtils'
import { InlineKeyboardButton } from 'telegraf/types'

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
    definitionExtends: JsonKeyboard['definitionExtends'] & {}
}
type HandleDefinitionResult = Record<string, Button[]>

type HandleTextOptions = {
    text: JsonButton['text']
    globals: ReplaceKeyboardData['globals']
}

type HandleIfOptions = {
    value: string | boolean
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

    private static _handleIf({
        globals = {},
        value
    }: HandleIfOptions) {
        if (typeof value == 'boolean') return value
        else {
            const result = Boolean(globals[value])
            return result
        }
    }

    private static async _handleDefinitionExtends(definitionExtends: JsonKeyboard['definitionExtends'] & {}) {
        const result: Record<string, JsonButton> = {}

        for (const definitionExtend of definitionExtends) {
            const {
                path,
                definitions,
                button
            } = definitionExtend

            const jsonKeyboard = await this._getJsonKeyboard(path)
            if (!jsonKeyboard) continue

            const {
                definition
            } = jsonKeyboard

            for (const [key, value] of Object.entries(definition)) {
                if (definitions?.length && !definitions.includes(key)) continue

                result[key] = {
                    ...value,
                    ...button,
                    data: {
                        ...value.data,
                        ...button.data,
                        $additional: {
                            ...value.data.$additional,
                            ...button.data?.$additional
                        },
                        $vars: [
                            ...value.data.$vars ?? [],
                            ...button.data?.$vars ?? []
                        ]
                    }
                }
            }
        }

        return result
    }

    private static async _handleDefinition({
        definition,
        variables,
        globals,
        values,
        definitionExtends
    }: HandleDefinitionOptions): Promise<HandleDefinitionResult> {
        const result = {} as HandleDefinitionResult

        const extendsDefinition = await this._handleDefinitionExtends(
            definitionExtends
        )
        definition = {
            ...extendsDefinition,
            ...definition
        }

        for (const key in definition) {
            const button = definition[key]
            const {
                text,
                data,
                name
            } = button

            const ifKey = data.$if ?? true
            const isShow = this._handleIf({ value: ifKey, globals })

            const eachKey = data.$each
            const datas =
                isShow ?
                    eachKey ?
                        values[eachKey] ?? [] :
                        [
                            {
                                text: '',
                                data: {}
                            }
                        ] :
                    []

            const row = datas.map(v => {
                const handledText = this._handleText({
                    text,
                    globals: {
                        ...globals,
                        '': v.text
                    }
                })

                const handledData = this._handleData({
                    data,
                    variables
                })
                const newData = {
                    ...handledData,
                    ...v.data
                }

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
                const row = maybeRow.reduce(
                    (prev, key) => {
                        const buttons = definition[key]
                        if(buttons?.length) {
                            prev.push(...buttons)
                        }
                        return prev
                    },
                    [] as InlineKeyboardButton.CallbackButton[]
                )

                result.push(
                    ...ArrayUtils.objectsGrid({
                        objects: row,
                        width: maxWidth
                    })
                )
            }
            else {
                result.push(
                    ...(definition[maybeRow] ?? [])
                        .map(v => [v])
                )
            }
        }

        return result
    }

    private static async _getJsonKeyboard(filename: string) {
        return await FileUtils.readJsonFromResource<JsonKeyboard>(
            join(
                this._keyboardFolder,
                `${filename}.${this._keyboardExtension}`
            )
        )
    }

    static async get(filename: string, data: ReplaceKeyboardData = {}): Promise<Keyboard> {
        const jsonKeyboard = await this._getJsonKeyboard(filename)
        if (!jsonKeyboard) return []

        const {
            variables,
            definition,
            markup,
            definitionExtends = []
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

        const handledDefinition = await this._handleDefinition({
            definition,
            variables: handledVariables,
            values: values ?? {},
            globals: globals ?? {},
            definitionExtends
        })

        return this._handleMarkup({
            markup,
            definition: handledDefinition,
            maxWidth
        })
    }
}