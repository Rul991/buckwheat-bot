import { InlineKeyboardMarkup } from 'telegraf/types'

export default class InlineKeyboardManager {
    private static _instance: InlineKeyboardManager | null = null

    private _keyboards!: Record<string, InlineKeyboardMarkup>

    constructor() {
        if(InlineKeyboardManager._instance) return InlineKeyboardManager._instance
        InlineKeyboardManager._instance = this
        
        this._keyboards = {}
    }

    async loadFromResource() {

    }

    get(name: string, data = '@') {
        return this._keyboards[name]
            .inline_keyboard
            .map(buttons => 
                buttons.map(button => {
                    if(!('callback_data' in button)) return button

                    return {...button, callback_data: button.callback_data.replaceAll('@', data)} 
                })
            )
    }
}