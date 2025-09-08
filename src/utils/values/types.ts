import { Context, NarrowedContext } from 'telegraf'
import { CallbackQuery, InlineKeyboardMarkup, LinkPreviewOptions, Message, MessageEntity, ParseMode, Update } from 'telegraf/types'

export type MaybeString = string | undefined
export type CommandStrings = [string, MaybeString, MaybeString]
export type CommandDescription = {
    needData: boolean, 
    argumentText?: string,
    replySupport: boolean, 
    isShow: boolean, 
    description: string, 
    name: string
    aliases: string[]
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

export type NewMemberContext = NarrowedContext<Context<Update>, {
    message: Update.New & Update.NonChannel & Message.NewChatMembersMessage;
    update_id: number;
}>

export type LeftMemberContext = NarrowedContext<Context<Update>, {
    message: Update.New & Update.NonChannel & Message.LeftChatMemberMessage;
    update_id: number;
}>

export type PhotoContext = NarrowedContext<Context<Update>, {
    message: Update.New & Update.NonChannel & Message.PhotoMessage;
    update_id: number;
}>

export type MessageContext = NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>

export type DiceValues = '🎲' | '🎯' | '🏀' | '⚽' | '🎳' | '🎰'
export type ModeTypes = 'prod' | 'dev'

export type InventoryItemDescription = {
    name: string,
    type: InventoryItemType
}
export type InventoryItemType = 'consumable' | 'oneInfinity' | 'manyInfinity'

export type Constructor<T> = any
export type AsyncOrSync<T = void> = Promise<T> | T

export type ClassTypes = 'knight' | 'thief' | 'sorcerer' | 'engineer' | 'bard' | 'unknown' | 'boss' | 'bot'
export type ClassRecord = Record<ClassTypes, string>

export type ExtraEditMessageText = {
    reply_markup?: InlineKeyboardMarkup
    entities?: MessageEntity[],
    link_preview_options?: LinkPreviewOptions,
    parse_mode?: ParseMode
}

export type NameObject = {name: string}
export type TopLevelObject = {id: number, level: number}

export type PrimitiveJavascriptTypes = 
  | 'string'
  | 'number'
  | 'bigint'
  | 'boolean'
  | 'symbol'
  | 'undefined'
  | 'function'
  | 'object'
  | 'array'
  | 'any'

export type ObjectJavascriptTypes = Record<string, PrimitiveJavascriptTypes | Record<string, PrimitiveJavascriptTypes>>
export type JavascriptTypes = PrimitiveJavascriptTypes | ObjectJavascriptTypes | (PrimitiveJavascriptTypes | ObjectJavascriptTypes)[]

export type AnyRecord = Record<string, any>
export type SchemaObject<T> = Record<keyof T, JavascriptTypes>
export type ObjectOrArray<T> = T | T[]
export type CallbackButtonValues = {text?: string, data?: string}

export type ItemExecuteOptions = {
    ctx: CallbackButtonContext, 
    user: {link: string, name: string},
    item: RequiredShopItem,
    count: number
}
export type ItemExecuteCallback = (options: ItemExecuteOptions) => AsyncOrSync<boolean>
export type RequiredShopItem = Required<ShopItem>
export type RequiredShopItemWithLength = RequiredShopItem  & { length: number; index: number }
export type ShopItem = 
{
    filename?: string | undefined,
    name?: string,
    description?: string,
    emoji?: string,
    price?: number,
    maxCount?: number,
    cooldown?: number
    execute: ItemExecuteCallback
}

export type ScrollerSendMessageOptions<T> = {
    currentPage: number
    length: number
    objects: T[]
    data: string
}

export type ScrollerEditMessageResult = {
    text: string,
    options?: ExtraEditMessageText
}