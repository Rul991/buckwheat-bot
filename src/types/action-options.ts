import type { CallbackQueryContext } from "grammy"
import type { BotContext } from "./bot"
import type { DiceContext, MessageContext, MessagePhotoContext, MessageTextContext, NewChatMemberContext, PreCheckoutQueryContext, ShippingQueryContext } from "./contexts"
import type { MaybeString } from "./types"
import type { CommandStrings } from "./command"
import type { PhotoSize, User } from "grammy/types"
import type { CommandType } from "../protos/commands_pb"

export type BaseActionOptions = {
    id: number
    chatId: number
}

export type CallbackQueryActionOptions<T> =
    & BaseActionOptions
    & {
        ctx: CallbackQueryContext<BotContext>
        data: T
    }

export type MessageActionOptions =
    & {
        chatId?: number
        id: number
        ctx: MessageContext
    }

export type BuckwheatCommandOptions =
    & BaseActionOptions
    & {
        ctx: MessageTextContext
        other: MaybeString
        commandStrings: CommandStrings
        replyOrUserFrom: User
        replyFrom?: User
    }

export type ConditionalCommandOptions = 
    & Omit<BuckwheatCommandOptions, 'other' | 'replyOrUserFrom' | 'replyFrom' | 'ctx'>
    & {
        ctx: MessageContext
    }

export type DiceActionOptions = 
    & BaseActionOptions
    & {
        value: number
        ctx: DiceContext
    }

export type BotUseActionOptions = 
    & BaseActionOptions
    & {
        ctx: BotContext
    }

export type PhotoActionOptions = 
    & BaseActionOptions
    & {
        ctx: MessagePhotoContext
        highQualityPhoto: PhotoSize
    }

export type ConversationActionOptions = {
    
}

export type PreCheckoutQueryOptions<T> = 
    & BaseActionOptions
    & {
        ctx: PreCheckoutQueryContext
        data: T
    }

export type ShippingQueryOptions<T> = 
    & BaseActionOptions
    & {
        ctx: ShippingQueryContext
        data: T
    }

export type NewChatMemberActionOptions =
    & BaseActionOptions
    & {
        ctx: NewChatMemberContext
        users: User[]
    }

export type ShowableActionsOptions = {
    [CommandType.Text]: BuckwheatCommandOptions
    [CommandType.Photo]: PhotoActionOptions
    [CommandType.Dice]: DiceActionOptions
}