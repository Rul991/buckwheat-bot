import { PreCheckoutQuery, SuccessfulPayment, Update, User } from 'telegraf/types'
import { CommandStrings, Ids, MaybeString } from './types'
import { MessageContext } from './contexts'
import { SuccessfulPaymentContext } from './contexts'
import { PreCheckoutQueryContext } from './contexts'
import { PhotoContext } from './contexts'
import { LeftMemberContext } from './contexts'
import { NewMemberContext } from './contexts'
import { DiceContext } from './contexts'
import { CallbackButtonContext } from './contexts'
import { TextContext } from './contexts'
import { ContextData } from './contexts'
import { Context } from 'telegraf'
import { BaseScene } from 'telegraf/scenes'

type RawOptions = Ids & {
    
}

type RawOptionsWithOther = RawOptions & {
    other: MaybeString
}

export type EveryMessageOptions = RawOptions & {
    ctx: MessageContext
}

export type LeftMemberOptions = RawOptions & {
    ctx: LeftMemberContext
}

export type NewMemberOptions = RawOptions & {
    ctx: NewMemberContext
}

export type PrecheckoutQueryOptions = {
    ctx: PreCheckoutQueryContext, 
    query: PreCheckoutQuery
}

export type SuccessfulPaymentOptions = {
    ctx: SuccessfulPaymentContext,
    payment: SuccessfulPayment
}

export type PhotoOptions = RawOptionsWithOther & {
    ctx: PhotoContext
}

export type SceneOptions<Data extends {}> = {
    scene: BaseScene<Context<Update> & ContextData<Data>>
}

export type DiceOptions = {
    ctx: DiceContext, 
    value: number
}

export type BuckwheatCommandOptions = RawOptionsWithOther & {
    ctx: TextContext
    replyFrom?: User
    replyOrUserFrom: User
}

export type ConditionalCommandOptions = RawOptions & {
    strings: CommandStrings
    ctx: MessageContext
}

export type CallbackButtonOptions<T> = RawOptions & {
    data: T
    ctx: CallbackButtonContext
}

export type ContextOptions = {
    text: BuckwheatCommandOptions
    photo: PhotoOptions
}