import { InlineKeyboardButton } from 'telegraf/types'
import FileUtils from '../../utils/FileUtils'

export default class InlineKeyboardManager {
    static async get(name: string, data = '@'): Promise<InlineKeyboardButton[][]> {
        const keyboards = await FileUtils.readJsonFromResource<InlineKeyboardButton[][]>(
            `json/inline_keyboards/${name}.json`
        )

        if(!keyboards) return []
        if(!Array.isArray(keyboards)) return []

        return keyboards.map(arr => 
            arr.map(button => {
                if('callback_data' in button) {
                    button.callback_data = button.callback_data.replaceAll('@', data)
                }
                return button
            })
        )
    }
}