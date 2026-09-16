import { Conversation, createConversation, type ConversationFlavor } from "@grammyjs/conversations"
import BaseAction from "./BaseAction"
import type { BotContext } from "../../../types/bot"
import type { Context, MiddlewareFn } from "grammy"
import type { ConversationActionOptions } from "../../../types/action-options"
import { MAX_CONVERSATION_TIME } from "../../../consts/time"

export default abstract class ConversationAction<T extends any[] = any[]> extends BaseAction {
    protected abstract _execute(conversation: Conversation<BotContext, Context>, ctx: Context, ...args: T): Promise<void>

    override async execute(_: ConversationActionOptions): Promise<MiddlewareFn<ConversationFlavor<BotContext>>> {
        return createConversation<BotContext, Context>(
            this._execute.bind(this),
            {
                id: this.name,
                maxMillisecondsToWait: MAX_CONVERSATION_TIME,
                parallel: true,
            }
        )
    }

    async enter(ctx: BotContext, ...args: T) {
        return await ctx.conversation.enter(this.name, ...args)
    }
}