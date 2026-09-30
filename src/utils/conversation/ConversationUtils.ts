import type { Conversation } from "@grammyjs/conversations"
import type { Message } from "grammy/types"
import type { Context } from "grammy"
import type { BotContext } from "../../types/bot"
import type { ReplyInConversationOptions } from "../../types/options"
import MessageUtils from "../bot/MessageUtils"
import type { GrullyI18nVars } from "@grully/i18n"
import MessageEntityUtils from "../bot/MessageEntityUtils"
import LazyValue from "../cache/LazyValue"

type GetTextOptions = {
    conversation: Conversation<BotContext, Context>
    needId: number
    max: number
    vars?: GrullyI18nVars
    key: string
    lazyKeys?: ReplyInConversationOptions['lazyKeys']
}

type LazyKey = (ReplyInConversationOptions['lazyKeys'] & {})[number]
type LazyKeys = LazyKey[]

export default class ConversationUtils {
    private static async _handleLazyVars(ctx: BotContext, lazyKeys: LazyKeys): Promise<GrullyI18nVars> {
        return (await Promise.all(
            Object.entries(ctx.vars)
                .map(
                    async ([key, value]) => {
                        if (value instanceof LazyValue) {
                            if (!lazyKeys.includes(key as LazyKey)) {
                                return [null, null] as const
                            }

                            const result = await value.get()
                            return [key, result] as const
                        }

                        return [key, value] as const
                    }
                )
        ))
            .reduce(
                (total, [key, value]) => {
                    if (key === null) return total
                    return {
                        ...total,
                        [key]: value
                    }
                },
                {}
            )
    }

    static async replyInConversation(conversation: Conversation<BotContext, Context>, key: string, rawOptions: ReplyInConversationOptions | ((ctx: BotContext) => ReplyInConversationOptions | Promise<ReplyInConversationOptions>) = {}): Promise<Message.TextMessage | undefined> {
        return await conversation.external(
            async ctx => {
                const options = typeof rawOptions == 'function' ?
                    await rawOptions(ctx) :
                    rawOptions

                const lazyKeys = options.lazyKeys ?? []

                return await MessageUtils.reply(
                    ctx,
                    key,
                    {
                        ...options,
                        vars: {
                            ...options.vars,
                            vars: await this._handleLazyVars(ctx, lazyKeys)
                        }
                    }
                )
            }
        )
    }

    static async getFormattedText({
        conversation,
        needId,
        vars,
        max,
        key,
        lazyKeys
    }: GetTextOptions): Promise<string> {
        await this.replyInConversation(
            conversation,
            key,
            {
                vars: {
                    ...vars,
                    max,
                },
                lazyKeys
            }
        )

        const ctx = await conversation.waitFor('msg:text')
            .andFrom(needId)
        const message = ctx.msg
        const result = MessageEntityUtils.messageToHtml(
            {
                ...message,
                text: message.text.slice(0, max)
            },
            -1
        )

        return result
    }
}