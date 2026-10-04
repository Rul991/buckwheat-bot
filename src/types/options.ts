import type { GrullyI18nVars } from "@grully/i18n"
import type { InlineKeyboardButton, InlineKeyboardMarkup, MessageEntity } from "grammy/types"
import type { BotContext } from "./bot"
import type ShowableAction from "../bot/actions/base/ShowableAction"
import type { CommandStrings } from "./command"
import type { Contexts, MessageTextContext } from "./contexts"
import type { CallbackQueryContext } from "grammy"
import type { CommandType } from "../protos/commands_pb"
import type { BaseScrollerData } from "../protos/scroller_pb"
import type { Message } from "@bufbuild/protobuf"
import type { AvaHistoryType } from "./unions"

export type ReplyOptions = {
    keyboard?: InlineKeyboardMarkup
    vars?: GrullyI18nVars
    chatId?: number | string
    entities?: MessageEntity[]
    isDisableLinkPreview?: boolean
}

export type ReplyInConversationOptions =
    & ReplyOptions
    & {
        lazyKeys?: (keyof BotContext["vars"])[]
    }

export type ReplyMediaOptions =
    & ReplyOptions
    & {
        key?: string
    }

export type ReplyTextAsDocumentOptions =
    & ReplyMediaOptions
    & {
        filename?: string
    }

export type EditMediaOptions =
    & ReplyMediaOptions
    & {
        type?: AvaHistoryType
    }

export type CallbackQueryActionGetOptions<T> = {
    data: Omit<T, '$typeName'>
    ctx: BotContext
    key?: string
    style?: InlineKeyboardButton['style']
    vars?: GrullyI18nVars
}

export type ShowableActionGetOptions<A extends ShowableAction<CommandType>> = {
    ctx: Contexts[A['type']]
    commandStrings: CommandStrings
    chatId: number
    id: number
}

export type ScrollerButtonEditMessageOptions<T, M extends Omit<BaseScrollerData, '$typeName' | '$unknown'> & Message<any>> = {
    ctx: CallbackQueryContext<BotContext>
    objects: T[]
    slicedObjects: T[]
    page: number
    maxPage: number
    data: M
    chatId: number
    id: number
}

export type AdminExecuteOptions = {
    ctx: MessageTextContext
    ms: number
    id: number
}

export type InvoiceOptions = {
    price: number
    payload: string
    vars?: ReplyOptions['vars']
}

export type AnswerPreCheckoutQueryOptions =
    | {
        ok: true
        key?: string
        vars?: GrullyI18nVars
    }
    | {
        ok: false
        key: string
        vars?: GrullyI18nVars
    }