import type { Update } from "grammy/types"
import type { BotContext } from "./bot"
import type { Context } from "grammy"
import type { CommandType } from "../protos/commands_pb"

type NotUndefined = {}
type FilteredContext<C extends Context, U extends Update> = C & FilteredContextCore<U>
type FilteredContextCore<U extends Update> = Record<"update", U> & Shortcuts<U>
interface Shortcuts<U extends Update> {
    message: [U["message"]] extends [object] ? U["message"] : undefined
    editedMessage: [U["edited_message"]] extends [object] ? U["edited_message"] : undefined
    channelPost: [U["channel_post"]] extends [object] ? U["channel_post"] : undefined
    editedChannelPost: [U["edited_channel_post"]] extends [object] ? U["edited_channel_post"] : undefined
    businessConnection: [U["business_connection"]] extends [object] ? U["business_connection"] : undefined
    businessMessage: [U["business_message"]] extends [object] ? U["business_message"] : undefined
    editedBusinessMessage: [U["edited_business_message"]] extends [object] ? U["edited_business_message"] : undefined
    deletedBusinessMessages: [U["deleted_business_messages"]] extends [object] ? U["deleted_business_messages"] : undefined
    guestMessage: [U["guest_message"]] extends [object] ? U["guest_message"] : undefined
    messageReaction: [U["message_reaction"]] extends [object] ? U["message_reaction"] : undefined
    messageReactionCount: [U["message_reaction_count"]] extends [object] ? U["message_reaction_count"] : undefined
    inlineQuery: [U["inline_query"]] extends [object] ? U["inline_query"] : undefined
    chosenInlineResult: [U["chosen_inline_result"]] extends [object] ? U["chosen_inline_result"] : undefined
    callbackQuery: [U["callback_query"]] extends [object] ? U["callback_query"] : undefined
    shippingQuery: [U["shipping_query"]] extends [object] ? U["shipping_query"] : undefined
    preCheckoutQuery: [U["pre_checkout_query"]] extends [object] ? U["pre_checkout_query"] : undefined
    poll: [U["poll"]] extends [object] ? U["poll"] : undefined
    pollAnswer: [U["poll_answer"]] extends [object] ? U["poll_answer"] : undefined
    myChatMember: [U["my_chat_member"]] extends [object] ? U["my_chat_member"] : undefined
    chatMember: [U["chat_member"]] extends [object] ? U["chat_member"] : undefined
    managedBot: [U["managed_bot"]] extends [object] ? U["managed_bot"] : undefined
    chatJoinRequest: [U["chat_join_request"]] extends [object] ? U["chat_join_request"] : undefined
    chatBoost: [U["chat_boost"]] extends [object] ? U["chat_boost"] : undefined
    removedChatBoost: [U["removed_chat_boost"]] extends [object] ? U["removed_chat_boost"] : undefined
    purchasedPaidMedia: [U["purchased_paid_media"]] extends [object] ? U["purchased_paid_media"] : undefined
    msg: [U["message"]] extends [object] ? U["message"] : [U["edited_message"]] extends [object] ? U["edited_message"] : [U["channel_post"]] extends [object] ? U["channel_post"] : [U["edited_channel_post"]] extends [object] ? U["edited_channel_post"] : [U["business_message"]] extends [object] ? U["business_message"] : [U["edited_business_message"]] extends [object] ? U["edited_business_message"] : [U["guest_message"]] extends [object] ? U["guest_message"] : [U["callback_query"]] extends [object] ? U["callback_query"]["message"] : undefined
    chat: [U["callback_query"]] extends [object] ? NonNullable<U["callback_query"]["message"]>["chat"] | undefined : [Shortcuts<U>["msg"]] extends [object] ? Shortcuts<U>["msg"]["chat"] : [U["deleted_business_messages"]] extends [object] ? U["deleted_business_messages"]["chat"] : [U["message_reaction"]] extends [object] ? U["message_reaction"]["chat"] : [U["message_reaction_count"]] extends [object] ? U["message_reaction_count"]["chat"] : [U["my_chat_member"]] extends [object] ? U["my_chat_member"]["chat"] : [U["chat_member"]] extends [object] ? U["chat_member"]["chat"] : [U["chat_join_request"]] extends [object] ? U["chat_join_request"]["chat"] : [U["chat_boost"]] extends [object] ? U["chat_boost"]["chat"] : [U["removed_chat_boost"]] extends [object] ? U["removed_chat_boost"]["chat"] : undefined
    senderChat: [Shortcuts<U>["msg"]] extends [object] ? Shortcuts<U>["msg"]["sender_chat"] : undefined
    from: [U["business_connection"]] extends [object] ? U["business_connection"]["user"] : [U["message_reaction"]] extends [object] ? U["message_reaction"]["user"] : [U["managed_bot"]] extends [object] ? U["managed_bot"]["user"] : [U["chat_boost"]] extends [object] ? U["chat_boost"]["boost"]["source"]["user"] : [U["removed_chat_boost"]] extends [object] ? U["removed_chat_boost"]["source"]["user"] : [U["callback_query"]] extends [object] ? U["callback_query"]["from"] : [Shortcuts<U>["msg"]] extends [object] ? Shortcuts<U>["msg"]["from"] : [U["inline_query"]] extends [object] ? U["inline_query"]["from"] : [U["chosen_inline_result"]] extends [object] ? U["chosen_inline_result"]["from"] : [U["shipping_query"]] extends [object] ? U["shipping_query"]["from"] : [U["pre_checkout_query"]] extends [object] ? U["pre_checkout_query"]["from"] : [U["my_chat_member"]] extends [object] ? U["my_chat_member"]["from"] : [U["chat_member"]] extends [object] ? U["chat_member"]["from"] : [U["chat_join_request"]] extends [object] ? U["chat_join_request"]["from"] : undefined
    msgId: [U["callback_query"]] extends [object] ? number | undefined : [Shortcuts<U>["msg"]] extends [object] ? number : [U["message_reaction"]] extends [object] ? number : [U["message_reaction_count"]] extends [object] ? number : undefined
    chatId: [U["callback_query"]] extends [object] ? number | undefined : [Shortcuts<U>["chat"]] extends [object] ? number : [U["business_connection"]] extends [object] ? number : undefined
    businessConnectionId: [U["callback_query"]] extends [object] ? string | undefined : [Shortcuts<U>["msg"]] extends [object] ? string | undefined : [U["business_connection"]] extends [object] ? string : [U["deleted_business_messages"]] extends [object] ? string : undefined
}

type L2ShallowFragment<L1 extends string> = Record<AddTwins<L1, never>, NotUndefined>
type AddTwins<L1 extends string, L2 extends string> = TwinsFromL1<L1, L2> | TwinsFromL2<L1, L2>
type TwinsFromL1<L1 extends string, L2 extends string> = L1 extends KeyOf<L1Equivalents> ? L1Equivalents[L1] : L2
type TwinsFromL2<L1 extends string, L2 extends string> = L1 extends KeyOf<L2Equivalents> ? L2 extends KeyOf<L2Equivalents[L1]> ? L2Equivalents[L1][L2] : L2 : L2
type L2Equivalents = {
    message: MessageEquivalents
    edited_message: MessageEquivalents
    channel_post: MessageEquivalents
    edited_channel_post: MessageEquivalents
    business_message: MessageEquivalents
    edited_business_message: MessageEquivalents
    guest_message: MessageEquivalents
}
type KeyOf<T> = string & keyof T
type L1Equivalents = {
    message: "from"
    edited_message: "from" | "edit_date"
    channel_post: "sender_chat"
    edited_channel_post: "sender_chat" | "edit_date"
    business_message: "from"
    edited_business_message: "from" | "edit_date"
}
type MessageEquivalents = {
    live_photo: "photo"
    animation: "document"
    entities: "text"
    caption_entities: "caption"
    is_topic_message: "message_thread_id"
}

export type MessageContext = FilteredContext<BotContext, Update & Record<"message", L2ShallowFragment<"message">> & Partial<Record<never, undefined>>>
export type MessageTextContext = FilteredContext<BotContext, Update & Record<"message", Record<AddTwins<"message", "text">, NotUndefined> & Partial<Record<never, undefined>>> & Partial<Record<"channel_post", undefined>>> | FilteredContext<BotContext, Update & Record<"channel_post", Record<AddTwins<"channel_post", "text">, NotUndefined> & Partial<Record<never, undefined>>>>
export type DiceContext = FilteredContext<BotContext, Update & Record<"message", Record<AddTwins<"message", "dice">, NotUndefined> & Partial<Record<never, undefined>>> & Partial<Record<"channel_post", undefined>>> | FilteredContext<BotContext, Update & Record<"channel_post", Record<AddTwins<"channel_post", "dice">, NotUndefined> & Partial<Record<never, undefined>>>>
export type MessagePhotoContext = FilteredContext<BotContext, Update & Record<"message", Record<AddTwins<"message", "photo">, NotUndefined> & Partial<Record<never, undefined>>> & Partial<Record<"channel_post", undefined>>> | FilteredContext<BotContext, Update & Record<"channel_post", Record<AddTwins<"channel_post", "photo">, NotUndefined> & Partial<Record<never, undefined>>>>

export type PreCheckoutQueryContext = FilteredContext<BotContext, Update & Record<"pre_checkout_query", L2ShallowFragment<"pre_checkout_query">> & Partial<Record<never, undefined>>>
export type ShippingQueryContext = FilteredContext<BotContext, Update & Record<"shipping_query", L2ShallowFragment<"shipping_query">> & Partial<Record<never, undefined>>>
export type NewChatMemberContext = FilteredContext<BotContext, Update & Record<"message", Record<AddTwins<"message", "new_chat_members">, NotUndefined> & Partial<Record<never, undefined>>> & Partial<Record<"channel_post", undefined>>> | FilteredContext<BotContext, Update & Record<"channel_post", Record<AddTwins<"channel_post", "new_chat_members">, NotUndefined> & Partial<Record<never, undefined>>>>

export type Contexts = {
    [CommandType.Text]: MessageTextContext
    [CommandType.Photo]: MessagePhotoContext
    [CommandType.Dice]: DiceContext
}