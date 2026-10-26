import type { BotContext } from "./bot"

export type BusinessType = 'shop' | 'casino' | 'bank'
export type BuckwheatBusinessOptions = {
    type: BusinessType
    ctx: BotContext
}