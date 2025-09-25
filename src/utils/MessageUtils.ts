import { InlineKeyboardMarkup, Message, ParseMode, TelegramEmoji } from 'telegraf/types'
import { Context } from 'telegraf'
import { MAX_MESSAGE_LENGTH, PARSE_MODE } from './values/consts'
import FileUtils from './FileUtils'
import Logging from './Logging'
import AnswerOptions from '../interfaces/options/AnswerOptions'
import FileAnswerOptions from '../interfaces/options/FileAnswerOptions'
import { ExtraEditMessageText, NewInvoiceParameters } from './values/types'
import ExceptionUtils from './ExceptionUtils'
import ObjectValidator from './ObjectValidator'
import { invoiceSchema } from './values/schemas'

export default class MessageUtils {
    private static async _getMessageOptions(
        ctx: Context, 
        {
            inlineKeyboard = [],
            disableNotification,
            chatId = ctx.chat?.id ?? -1,
            isReply = true,
            replyMarkup
        }: AnswerOptions = {}
    ) {
        return {
            reply_parameters: isReply && ctx.message?.message_id ? {
                message_id: ctx.message.message_id
            } : undefined,
            reply_markup: {
                ...replyMarkup,
                inline_keyboard: inlineKeyboard
            },
            disable_notification: disableNotification,
            parse_mode: PARSE_MODE as ParseMode,
            chatId: chatId ?? -1
        }
    }

    static async answer(
        ctx: Context, 
        text: string, 
        options: AnswerOptions = {}
    ): Promise<Message.TextMessage> {
        const emptyMessage: Message.TextMessage = {
            text: '', 
            message_id: -1, 
            date: -1, 
            chat: {
                first_name: '', 
                type: 'private', 
                id: options.chatId ?? -1
            }
        }

        const messageOptions = await this._getMessageOptions(ctx, options)
        const {chatId} = messageOptions
        
        if(!text.length) return emptyMessage
        if(chatId == -1) return emptyMessage

        let lastMessage: Message.TextMessage = emptyMessage

        for (let i = 0; i < text.length; i += MAX_MESSAGE_LENGTH) {
            const partText = text.substring(i, i + MAX_MESSAGE_LENGTH)

            try {
                lastMessage = await ctx.telegram.sendMessage(
                    chatId,
                    partText, 
                    messageOptions
                )
            }
            catch(e) {
                try {
                    lastMessage = await ctx.telegram.sendMessage(
                        chatId, 
                        partText, 
                        {
                            ...messageOptions,
                            parse_mode: undefined
                        }
                    )
                }
                catch(e) {
                    Logging.error(e)
                    return emptyMessage
                }
            }
        }

        return lastMessage
    }

    static async todo(ctx: Context): Promise<Message.TextMessage> {
        return this.answer(ctx, 'Кажется, команда не работает еще!')
    }

    static async sendWrongCommandMessage(ctx: Context): Promise<void> {
        await this.answerMessageFromResource(
            ctx,
            'text/commands/other/wrong-command.pug'
        )
    }

    static async answerMessageFromResource(
        ctx: Context, 
        path: string,
        options: FileAnswerOptions = {}
    ): Promise<Message.TextMessage> {
        const text = await FileUtils.readPugFromResource(path, options)

        return await this.answer(
            ctx, 
            text, 
            options
        )
    }

    static async answerPhoto(
        ctx: Context,
        text: string,
        photoId: string,
        options: AnswerOptions = {}
    ): Promise<boolean> {
        return await ExceptionUtils.handle(async () => {
            const extra = await this._getMessageOptions(ctx, options)
            if(extra.chatId == -1) {
                Logging.error(`Cant send photo '${photoId}', chat id equal -1`)
                return
            }

            await ctx.telegram.sendPhoto(
                extra.chatId,
                photoId,
                {
                    ...extra,
                    caption: text
                }
            )
        })
    }

    static async editMarkup(ctx: Context, markup?: InlineKeyboardMarkup): Promise<boolean> {
        return await ExceptionUtils.handle(async () => {
            await ctx.editMessageReplyMarkup(markup)
        })
    }

    static async editText(ctx: Context, text: string, options?: ExtraEditMessageText): Promise<boolean> {
        return await ExceptionUtils.handle(async () => {
            await ctx.editMessageText(text, {parse_mode: PARSE_MODE, ...options})
        })
    }

    static async react(ctx: Context, reaction: TelegramEmoji): Promise<boolean> {
        return await ExceptionUtils.handle(async () => {
            await ctx.react(reaction, true)
        })
    }

    static async deleteMessage(ctx: Context, messageId?: number): Promise<boolean> {
        return await ExceptionUtils.handle(async () => {
            await ctx.deleteMessage(messageId)
        })
    }

    static async answerInvoice(ctx: Context, params: NewInvoiceParameters, extra?: AnswerOptions): Promise<boolean> {
        return await ExceptionUtils.handle(async () => {
            await ctx.replyWithInvoice(
                {
                    ...params,
                    currency: 'XTR',
                    provider_token: ''
                },
                await this._getMessageOptions(ctx, extra)
            )
        })
    }

    static async answerInvoiceFromFile(ctx: Context, path: string, extra?: AnswerOptions): Promise<boolean> {
        const json = await FileUtils.readJsonFromResource<NewInvoiceParameters>(path)
        if(!json) return false
        if(!ObjectValidator.isValidatedObject(json, invoiceSchema)) return false

        return await this.answerInvoice(
            ctx,
            json,
            extra
        )
    }
}