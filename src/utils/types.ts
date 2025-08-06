import { Context } from 'telegraf'
import { CallbackQuery, Update } from 'telegraf/types'

export type MaybeString = string | undefined
export type CommandStrings = [string, MaybeString, MaybeString]
export type DiceValues = '🎲' | '🎯' | '🏀' | '⚽' | '🎳' | '🎰'
export type CallbackButtonContext = Context<Update.CallbackQueryUpdate<CallbackQuery>> & Omit<Context<Update>, keyof Context<Update>>