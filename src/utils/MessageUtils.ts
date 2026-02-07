import { InlineKeyboardMarkup, InputFile, Message, ParseMode, TelegramEmoji } from 'telegraf/types'
import { Context } from 'telegraf'
import { CALLBACK_DATA_MAX_SIZE, DATABASE_KEYBOARD_NAME, FIRST_INDEX, MAX_MESSAGE_LENGTH, NOT_FOUND_INDEX, PARSE_MODE } from './values/consts'
import FileUtils from './FileUtils'
import Logging from './Logging'
import AnswerOptions from '../interfaces/options/AnswerOptions'
import FileAnswerOptions from '../interfaces/options/FileAnswerOptions'
import { DiceValues, ExtraEditMessageMedia, ExtraEditMessageText, FileOptions, InputMediaWrapCaption, NewInvoiceParameters, TextAsFileOptions } from './values/types/types'
import ExceptionUtils from './ExceptionUtils'
import ObjectValidator from './ObjectValidator'
import { invoiceSchema } from './values/schemas'
import KeyboardService from '../classes/db/services/keyboard/KeyboardService'

export default class MessageUtils {
    private static async _handleInlineKeyboard(
        ctx: Context,
        inlineKeyboard: AnswerOptions['inlineKeyboard']
    ): Promise<AnswerOptions['inlineKeyboard']> {
        if (!inlineKeyboard) return inlineKeyboard

        const hasBigData = inlineKeyboard.some(row => {
            return row.some(btn => {
                if (!('callback_data' in btn)) return false
                const buffer = Buffer.from(btn.callback_data)
                const length = buffer.byteLength

                return length > CALLBACK_DATA_MAX_SIZE
            })
        })

        if (!hasBigData) {
            return inlineKeyboard
        }

        const hasNeedCtxProperties = ctx.callbackQuery &&
            ctx.callbackQuery.message &&
            ctx.from

        if (hasNeedCtxProperties) {
            const messageId = ctx.callbackQuery.message!.message_id
            const id = ctx.from.id
            const chatId = ctx.chat?.id ?? id

            const dbKeyboard = inlineKeyboard
                .map(row => {
                    return row.map(btn => {
                        if (!('callback_data' in btn)) {
                            return ''
                        }
                        else {
                            return btn.callback_data
                        }
                    })
                })

            await KeyboardService.create({
                id,
                messageId,
                keyboard: dbKeyboard,
                chatId
            })

            const ids = {
                msgId: messageId,
                id
            }

            const result = inlineKeyboard.map((row, y) => {
                return row.map((btn, x) => {
                    return {
                        text: btn.text,
                        callback_data: `${DATABASE_KEYBOARD_NAME}_${JSON.stringify({
                            ...ids,
                            pos: [x, y]
                        })
                            }`
                    }
                })
            })

            Logging.system(
                "MessageUtils._handleInlineKeyboard",
                {
                    result,
                    raw: inlineKeyboard
                }
            )
            return result
        }

        Logging.error('no messageId or userId in', ctx, inlineKeyboard)
        return []
    }

    private static async _getMessageOptions(
        ctx: Context,
        {
            inlineKeyboard: rawInlineKeyboard,
            disableNotification,
            chatId = ctx.chat?.id ?? NOT_FOUND_INDEX,
            isReply = true,
            replyMarkup
        }: AnswerOptions = {}
    ) {
        const inlineKeyboard = await this._handleInlineKeyboard(
            ctx,
            rawInlineKeyboard
        ) ?? []

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
            chatId
        }
    }

    static async answer(
        ctx: Context,
        text: string,
        options: AnswerOptions = {}
    ): Promise<Message.TextMessage> {
        const emptyMessage: Message.TextMessage = {
            text: '',
            message_id: NOT_FOUND_INDEX,
            date: NOT_FOUND_INDEX,
            chat: {
                first_name: '',
                type: 'private',
                id: options.chatId ?? NOT_FOUND_INDEX
            }
        }

        const messageOptions = await this._getMessageOptions(ctx, options)
        const { chatId } = messageOptions

        if (!text.length) return emptyMessage
        if (chatId == NOT_FOUND_INDEX) return emptyMessage

        let lastMessage = emptyMessage

        await ExceptionUtils.handle(async () => {
            ctx.sendChatAction('typing')
            const partText = text.substring(FIRST_INDEX, MAX_MESSAGE_LENGTH - 1)
            lastMessage = await ctx.telegram.sendMessage(
                chatId,
                partText,
                messageOptions
            )
        })
        return lastMessage
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

    static async answerDice(
        ctx: Context,
        dice: DiceValues,
        options: AnswerOptions = {}
    ): Promise<Message.DiceMessage | null> {
        let msg: Message.DiceMessage | null = null

        await ExceptionUtils.handle(async () => {
            const extra = await this._getMessageOptions(ctx, options)

            if (extra.chatId == NOT_FOUND_INDEX) {
                Logging.error(`chat id equal -1`)
                return
            }

            ctx.sendChatAction('typing')
            msg = await ctx.telegram.sendDice(
                extra.chatId,
                {
                    ...extra,
                    emoji: dice
                }
            )
        })

        return msg ?? {
            dice: {
                emoji: '',
                value: NOT_FOUND_INDEX
            },
            message_id: NOT_FOUND_INDEX,
            date: NOT_FOUND_INDEX,
            chat: {
                first_name: '',
                id: NOT_FOUND_INDEX,
                type: 'private'
            }
        }
    }

    static async answerPhoto(
        ctx: Context,
        text: string,
        photoId: string,
        options: AnswerOptions = {}
    ): Promise<boolean> {
        return await ExceptionUtils.handle(async () => {
            const extra = await this._getMessageOptions(ctx, options)

            if (extra.chatId == -1) {
                Logging.error(`Cant send photo '${photoId}', chat id equal -1`)
                return
            }

            ctx.sendChatAction('upload_photo')
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

    private static async _updateEditOptions(ctx: Context, options?: ExtraEditMessageText) {
        const replyMarkup = options?.reply_markup
        const inlineKeyboard = await this._handleInlineKeyboard(
            ctx,
            replyMarkup?.inline_keyboard
        ) ?? []

        return {
            ...options,
            parse_mode: PARSE_MODE,
            reply_parameters: ctx.message ? {
                message_id: ctx.message.message_id
            } : undefined,
            reply_markup: {
                ...replyMarkup,
                inline_keyboard: inlineKeyboard
            }
        } as ExtraEditMessageText
    }

    static async editMarkup(ctx: Context, markup?: InlineKeyboardMarkup): Promise<boolean> {
        return await ExceptionUtils.handle(async () => {
            await ctx.editMessageReplyMarkup(markup)
        })
    }

    static async editText(ctx: Context, text: string, options?: ExtraEditMessageText): Promise<boolean> {
        try {
            await ctx.editMessageText(text, await this._updateEditOptions(ctx, options))
            return true
        }
        catch (e) {
            Logging.error(e)

            await ctx.reply(text, await this._updateEditOptions(ctx, options))
            await this.deleteMessage(ctx)
            return false
        }
    }

    static async editTextFromResource(ctx: Context, path: string, options: FileAnswerOptions = {}) {
        const text = await FileUtils.readPugFromResource(path, options)
        const messageOptions = await this._getMessageOptions(ctx, options)

        return await this.editText(
            ctx,
            text,
            messageOptions
        )
    }

    static async editMedia(
        ctx: Context,
        media: InputMediaWrapCaption,
        options?: ExtraEditMessageMedia,
    ) {
        return await ExceptionUtils.handle(async () => {
            const usedOptions = await this._updateEditOptions(ctx, options)
            await ctx.editMessageMedia(
                {
                    ...media,
                    ...usedOptions
                },
                usedOptions
            )
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
        if (!json) return false
        if (!ObjectValidator.isValidatedObject(json, invoiceSchema)) return false

        return await this.answerInvoice(
            ctx,
            json,
            extra
        )
    }

    static async answerFile(
        ctx: Context,
        file: string | InputFile,
        options?: FileOptions
    ) {
        return await ExceptionUtils.handle(async () => {
            await ctx.replyWithDocument(
                file,
                {
                    parse_mode: PARSE_MODE,
                    ...options
                }
            )
        })
    }

    static async answerTextAsFile(
        ctx: Context,
        {
            filename = 'file.txt',
            text
        }: TextAsFileOptions,
        options?: FileOptions
    ) {
        const buffer = Buffer.from(text, 'utf-8')
        const file: InputFile = {
            filename,
            source: buffer,
        }

        return await this.answerFile(
            ctx,
            file,
            options
        )
    }
}