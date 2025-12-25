import { Context, NarrowedContext, Scenes } from 'telegraf'
import { SceneSession, WizardSessionData } from 'telegraf/scenes'
import { SessionContext } from 'telegraf/session'
import { IdContextData } from './types'
import { Update, Message, CallbackQuery } from 'telegraf/types'

export type SceneContextData<D extends {} = {}> = {
    scene: Scenes.SceneContextScene<
        SessionContext<SceneSession<
            D & WizardSessionData
        >
        >, D & Scenes.WizardSessionData
    > & {
        state: D
    }
}

export type ContextData<D extends {} = {}> = SceneContextData<D> & IdContextData

export type TextContext = Context<{
    message: Update.New & Update.NonChannel & Message.TextMessage
    update_id: number
}> & Omit<Context<Update>, keyof Context<Update>> & ContextData

export type CallbackButtonContext = Context<Update.CallbackQueryUpdate<CallbackQuery>> &
    Omit<Context<Update>, keyof Context<Update>> & ContextData

export type DiceContext = NarrowedContext<Context<Update>, {
    message: Update.New & Update.NonChannel & Message.DiceMessage
    update_id: number
}> & ContextData

export type NewMemberContext = NarrowedContext<Context<Update>, {
    message: Update.New & Update.NonChannel & Message.NewChatMembersMessage
    update_id: number
}> & ContextData

export type LeftMemberContext = NarrowedContext<Context<Update>, {
    message: Update.New & Update.NonChannel & Message.LeftChatMemberMessage
    update_id: number
}> & ContextData

export type PhotoContext = NarrowedContext<Context<Update>, {
    message: Update.New & Update.NonChannel & Message.PhotoMessage
    update_id: number
}> & ContextData

export type PreCheckoutQueryContext = NarrowedContext<Context<Update>, Update.PreCheckoutQueryUpdate> & ContextData

export type SuccessfulPaymentContext = NarrowedContext<Context<Update>, {
    message: Update.New & Update.NonChannel & Message.SuccessfulPaymentMessage
    update_id: number
}> & ContextData

export type MessageContext<D extends {} = any> = NarrowedContext<Context<Update>, Update.MessageUpdate<Message>> & ContextData<D>