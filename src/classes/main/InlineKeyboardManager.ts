import FileUtils from '../../utils/FileUtils'
import { CallbackButtonMapValues, CallbackButtonValue, ObjectOrArray, CallbackButtonGlobals } from '../../utils/values/types/types'
import { DATA_REPLACEABLE_SYMBOL, MAX_BUTTONS_IN_HORISONTAL } from '../../utils/values/consts'
import { InlineKeyboardButton } from 'telegraf/types'
import ArrayUtils from '../../utils/ArrayUtils'
import NumberByteConverter from '../../utils/NumberToBytesConverter'

type GetCallback<T, K> = (keyboard: T) => K
type GetOptions<T, K> = {
    folder?: string,
    isArray?: boolean,
    callback: GetCallback<T, K>
    name: string
}
type Result = InlineKeyboardButton.CallbackButton
type JsonValue = {
    definition: DefinitionRecord,
    values: ObjectOrArray<string>[]
}
type DefinitionRecord = Record<string, CallbackButtonValue>

export default class InlineKeyboardManager {
    private static _getPath(name: string): string {
        return `json/inline_keyboards/${name}.json`
    }

    private static _replaceGlobals(text: string, data?: CallbackButtonGlobals): string {
        let result: string = text
        const usedData = data ?? {}

        for (const key in usedData) {
            result = result.replaceAll(
                `${DATA_REPLACEABLE_SYMBOL}{${key}}`,
                usedData[key].toString()
            )
        }

        return result
    }

    private static _replaceValues(text: string, data?: string): string {
        if(!text) return ''
        else if(!data) return text
        
        return text
            .replaceAll(
                DATA_REPLACEABLE_SYMBOL, 
                data
            )
    }

    private static _optimizeData(result: Result[][]): Result[][] {
        // for (const arr of result) {
        //     for (const v of arr) {
        //         v.callback_data = NumberByteConverter.replaceNumberToBytes(v.callback_data)
        //     }
        // }

        return result
    }

    private static async _get<T, K = T>(
        {
            name,
            folder = 'get',
            isArray,
            callback
        }: GetOptions<T, K>
    ): Promise<K | null> {
        const keyboard = await FileUtils.readJsonFromResource<T>(
            this._getPath(`${folder}/${name}`)
        )
        if(!keyboard) return null
        if(typeof isArray !== 'undefined' && isArray != keyboard instanceof Array) return null

        const result = callback(keyboard)
        return result
    }

    static async get(name: string, data?: string | CallbackButtonGlobals): Promise<Result[][]> {
        const result = await this._get<Result[][]>({
            name,
            callback: keyboard => {
                return keyboard.map(arr => 
                    arr.map(button => {
                        if(typeof data == 'string') {
                            button.callback_data = this._replaceValues(button.callback_data, data)
                        }
                        else {
                            button.callback_data = this._replaceGlobals(button.callback_data, data)
                        }
                        return button
                    })
                )
            },
            isArray: true
        }) ?? []
        
        return this._optimizeData(result)
    }

    static async map(name: string, values: CallbackButtonMapValues): Promise<Result[][]> {
        const keyboard = await this._get<
            JsonValue, 
            Result[][]
        >({
            name,
            callback: keyboard => {
                const resultKeyboard: Result[][] = []
                const {
                    maxWidth = MAX_BUTTONS_IN_HORISONTAL
                } = values

                for (const button of keyboard.values) {
                    const isArray = button instanceof Array
                    const buttonArray = isArray ? button : [button]

                    const subResult: Result[] = []

                    for (const key of buttonArray) {
                        const value = keyboard.definition[key]
                        if(!value) continue

                        const text = this._replaceGlobals(value.text, values.globals)
                        const data = this._replaceGlobals(value.data, values.globals)

                        if(value.notEach) {
                            const result = {
                                text, 
                                callback_data: data
                            }
                            if(isArray) {
                                subResult.push(result)
                            }
                            else {
                                resultKeyboard.push([result])
                            }
                            continue
                        }

                        const valueValues = values.values[key]
                        if(!valueValues) continue

                        const resultValues = valueValues.map(v => ({
                            text: this._replaceValues(text, v.text),
                            callback_data: this._replaceValues(data, v.data)
                        }))

                        if(isArray) {
                            subResult.push(
                                ...resultValues
                            )
                        }
                        else {
                            resultKeyboard.push(
                                ...resultValues.map(v => [v])
                            )
                        }
                    }

                    if(subResult.length) {
                        resultKeyboard.push(...ArrayUtils.objectsGrid({
                            objects: subResult,
                            width: maxWidth
                        }))
                    }
                }

                return resultKeyboard
            },
            folder: 'map'
        }) ?? []

        return this._optimizeData(keyboard)
    }
}