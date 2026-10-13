import { InlineKeyboard } from "grammy"
import type { BotContext } from "../../types/bot"
import type { KeyboardBuilder, KeyboardCallback, KeyboardCountOptions } from "../../types/keyboard"
import ArrayUtils from "../math/ArrayUtils"

export default class KeyboardCreator {
    static create<T, C extends BotContext = BotContext>(callback: KeyboardCallback<T, C>): KeyboardBuilder<T, C> {
        return async (ctx, data) => {
            const keyboard = new InlineKeyboard()
            const keyboardAfterCallback = await callback({
                ctx,
                data: data as T,
                keyboard
            })
            return keyboardAfterCallback ?? keyboard
        }
    }

    static async count(options: KeyboardCountOptions): Promise<InlineKeyboard> {
        const {
            callback,
            gridWidth = 5
        } = options
        let keyboard = new InlineKeyboard()

        const indexes = ArrayUtils.generateMultipliedSequence(options)
        const grid = ArrayUtils.objectsGrid({
            objects: indexes,
            width: gridWidth
        })

        for (const row of grid) {
            for (const index of row) {
                keyboard = await callback({
                    keyboard,
                    index
                }) ?? keyboard
            }
            keyboard.row()
        }

        return keyboard
    }
}