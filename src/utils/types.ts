import { Context, NarrowedContext } from 'telegraf'
import { CallbackQuery, Message, Update } from 'telegraf/types'

export type MaybeString = string | undefined
export type CommandStrings = [string, MaybeString, MaybeString]
export type CommandDescription = {
    needData: boolean, 
    argumentText?: string,
    replySupport: boolean, 
    isShow: boolean, 
    description: string, 
    name: string
}

export type TextContext = Context<{
    message: Update.New & Update.NonChannel & Message.TextMessage;
    update_id: number;
}> & Omit<Context<Update>, keyof Context<Update>>

export type CallbackButtonContext = Context<Update.CallbackQueryUpdate<CallbackQuery>> 
    & Omit<Context<Update>, keyof Context<Update>>

export type DiceContext = NarrowedContext<Context<Update>, {
    message: Update.New & Update.NonChannel & Message.DiceMessage;
    update_id: number;
}>

export type MessageContext = NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>

export type DiceValues = '🎲' | '🎯' | '🏀' | '⚽' | '🎳' | '🎰'
export type ModeTypes = 'prod' | 'dev'

export type Constructor<T> = any
export type AsyncOrSync<T = void> = Promise<T> | T