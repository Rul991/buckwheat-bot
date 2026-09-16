import type { BotContext } from "./bot"

export type TopValues = {
    id: number
    value: number | string
}

export type HandleSortedValuesOptions = {
    values: TopValues[]
    chatId: number
    ctx: BotContext
}