import type { Conversation } from "@grammyjs/conversations"
import type { Message } from "grammy/types"
import type { Context } from "grammy"
import type { BotContext } from "../../types/bot"
import type { ReplyOptions } from "../../types/options"
import MessageUtils from "../bot/MessageUtils"
import type { GrullyI18nVars } from "@grully/i18n"
import MessageEntityUtils from "../bot/MessageEntityUtils"

type GetTextOptions = {
    conversation: Conversation<BotContext, Context>
    needId: number
    max: number
    vars?: GrullyI18nVars
    key: string
}

export default class ConversationUtils {
    static async replyInConversation(conversation: Conversation<BotContext, Context>, key: string, rawOptions: ReplyOptions | ((ctx: BotContext) => ReplyOptions | Promise<ReplyOptions>) = {}): Promise<Message.TextMessage | undefined> {
        return await conversation.external(
            async ctx => {
                const options = typeof rawOptions == 'function' ?
                    await rawOptions(ctx) :
                    rawOptions

                return await MessageUtils.reply(
                    ctx,
                    key,
                    {
                        ...options,
                        vars: {
                            ...options.vars,
                            vars: ctx.vars
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
        key
    }: GetTextOptions): Promise<string> {
        await this.replyInConversation(
            conversation,
            key,
            {
                vars: {
                    ...vars,
                    max,
                }
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