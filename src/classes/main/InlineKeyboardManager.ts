import { InlineKeyboardButton, InlineKeyboardMarkup, KeyboardButton } from 'telegraf/types'
import FileUtils from '../../utils/FileUtils'

export default class InlineKeyboardManager {
    static async get(name: string, data = '@'): Promise<InlineKeyboardButton[][] | null> {
        return await FileUtils.readJsonFromResource<InlineKeyboardButton[][]>(`json/inline_keyboards/${name}.json`)
    }
}