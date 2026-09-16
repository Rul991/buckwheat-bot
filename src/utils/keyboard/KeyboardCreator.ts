import { InlineKeyboard } from "grammy"
import type { BotContext } from "../../types/bot"
import type { KeyboardBuilder, KeyboardCallback } from "../../types/keyboard"

export default class KeyboardCreator {
    static create<T, C extends BotContext = BotContext>(callback: KeyboardCallback<T, C>): KeyboardBuilder<T, C> {
        return async (ctx, data) => {
            const keyboard = new InlineKeyboard()
            await callback({
                ctx,
                data: data as T,
                keyboard
            })
            return keyboard
        }
    }
}