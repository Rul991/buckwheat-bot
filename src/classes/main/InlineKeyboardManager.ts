import FileUtils from '../../utils/FileUtils'
import { CallbackButtonValues, ObjectOrArray } from '../../utils/values/types'
import { DATA_REPLACEABLE_SYMBOL } from '../../utils/values/consts'
import { InlineKeyboardButton } from 'telegraf/types'

type GetCallback<T, K> = (keyboard: T) => K
type GetOptions<T, K> = {
    folder?: string,
    isArray?: boolean,
    callback: GetCallback<T, K>
    name: string
}
type Result = InlineKeyboardButton.CallbackButton
type JsonValue = {notEach?: boolean, text: string, data: string, isHorisontal?: boolean}

export default class InlineKeyboardManager {
    private static _getPath(name: string): string {
        return `json/inline_keyboards/${name}.json`
    }

    private static _replaceAll(text?: string, data = DATA_REPLACEABLE_SYMBOL): string {
        return text?.replaceAll(DATA_REPLACEABLE_SYMBOL, data) ?? ''
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

        return callback(keyboard)
    }

    static async get(name: string, data?: string): Promise<Result[][]> {
        return await this._get<Result[][]>({
            name,
            callback: keyboard => {
                return keyboard.map(arr => 
                    arr.map(button => {
                        button.callback_data = this._replaceAll(button.callback_data, data)
                        return button
                    })
                )
            },
            isArray: true
        }) ?? []
    }

    static async map(name: string, values: CallbackButtonValues[]): Promise<Result[][]> {
        const keyboard = await this._get<
            ObjectOrArray<JsonValue>, 
            Result[][]
        >({
            name,
            callback: keyboard => {
                const resultKeyboard: Result[][] = []
                const buttons = keyboard instanceof Array ? keyboard : [keyboard]

                for (const button of buttons) {
                    if(button.notEach) {
                        resultKeyboard.push([{text: button.text, callback_data: button.data}])
                        continue
                    }

                    const keyboard: Result[] = values.map(({text, data}) => {
                        return {
                            text: this._replaceAll(button.text, text),
                            callback_data: this._replaceAll(button.data, data)
                        } as Result
                    })

                    if(button.isHorisontal) {
                        resultKeyboard.push(keyboard)
                    }
                    else {
                        resultKeyboard.push(...(keyboard.map(kb => [kb])))
                    }
                }

                return resultKeyboard
            },
            folder: 'map'
        })

        return keyboard ? keyboard : []
    }
}