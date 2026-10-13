import type { InlineKeyboard } from "grammy"
import type { BotContext } from "./bot"
import type { GenerateMultipliedSequenceOptions } from "./array"

export type KeyboardCallback<T, C extends BotContext = BotContext> = (options: KeyboardDataOptions<T, C>) => Promise<void | InlineKeyboard>

export type KeyboardDataOptions<T, C extends BotContext = BotContext> = {
    ctx: C
    keyboard: InlineKeyboard
    data: T
}

export type KeyboardBuilder<T, C extends BotContext> = (ctx: C, data: Omit<T, '$typeName'>) => Promise<InlineKeyboard>
export type KeyboardCountOptions =
    & GenerateMultipliedSequenceOptions
    & {
        callback: (options: {keyboard: InlineKeyboard, index: number}) => Promise<void | InlineKeyboard>
        gridWidth?: number
    }