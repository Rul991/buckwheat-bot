import type { BotContext } from "./bot"
import type { Filter, CallbackQueryContext as GrammyCallbackQueryContext } from "grammy"
import type { CommandType } from "../protos/commands_pb"

export type MessageContext = Filter<BotContext, 'message'>
export type MessageTextContext = Filter<BotContext, 'msg:text'>

export type DiceContext = Filter<BotContext, 'msg:dice'>
export type MessagePhotoContext = Filter<BotContext, 'msg:photo'>

export type PreCheckoutQueryContext = Filter<BotContext, "pre_checkout_query">
export type SuccessfulPaymentMessageContext = Filter<BotContext, "msg:successful_payment">

export type CallbackQueryContext<T> = GrammyCallbackQueryContext<BotContext<T>>
export type NewChatMemberContext = Filter<BotContext, "msg:new_chat_members">
export type ChatJoinRequestContext = Filter<BotContext, 'chat_join_request'>

export type Contexts = {
    [CommandType.Text]: MessageTextContext
    [CommandType.Photo]: MessagePhotoContext
    [CommandType.Dice]: DiceContext
}