import type { BotContext } from "./bot"
import type { CallbackQueryContext, DiceContext, MessageContext, MessagePhotoContext, MessageTextContext, NewChatMemberContext, PreCheckoutQueryContext, SuccessfulPaymentMessageContext } from "./contexts"
import type { MaybeString } from "./types"
import type { CommandStrings } from "./command"
import type { PhotoSize, PreCheckoutQuery, SuccessfulPayment, User } from "grammy/types"
import type { CommandType } from "../protos/commands_pb"

export type BaseActionOptions = {
    id: number
    chatId: number
}

export type CallbackQueryActionOptions<T> =
    & BaseActionOptions
    & {
        ctx: CallbackQueryContext<T>
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
    & {
        id: number
        ctx: PreCheckoutQueryContext
        data: T
        query: PreCheckoutQuery
    }

export type SuccesfulPaymentOptions<T> = 
    & BaseActionOptions
    & {
        ctx: SuccessfulPaymentMessageContext
        data: T
        payment: SuccessfulPayment
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