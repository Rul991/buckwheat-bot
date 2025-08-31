import { InlineKeyboardMarkup, Message, ParseMode } from 'telegraf/types'
import { Context } from 'telegraf'
import InlineKeyboardManager from '../classes/main/InlineKeyboardManager'
import { MAX_MESSAGE_LENGTH, PARSE_MODE } from './values/consts'
import FileUtils from './FileUtils'
import Logging from './Logging'
import AnswerOptions from '../interfaces/options/AnswerOptions'
import FileAnswerOptions from '../interfaces/options/FileAnswerOptions'
import { ExtraEditMessageText } from './values/types'

export default class MessageUtils {
    private static async _getMessageOptions(
        ctx: Context, 
        {
            inlineKeyboard = ['empty', ''],
            disableNotification,
            chatId = ctx.chat?.id ?? -1,
            isReply = true
        }: AnswerOptions = {}
    ) {
        return {
            reply_parameters: isReply && ctx.message?.message_id ? {
                message_id: ctx.message.message_id
            } : undefined,
            reply_markup: {
                inline_keyboard: await InlineKeyboardManager.get(...inlineKeyboard)
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
        try {
            const extra = await this._getMessageOptions(ctx, options)
            if(extra.chatId == -1) {
                Logging.error(`Cant send photo '${photoId}', chat id equal -1`)
                return true
            }

            await ctx.telegram.sendPhoto(
                extra.chatId,
                photoId,
                {
                    ...extra,
                    caption: text
                }
            )

            return true
        }
        catch(e) {
            Logging.error(e)
            return false
        }
    }

    static async editMarkup(ctx: Context, markup?: InlineKeyboardMarkup): Promise<boolean> {
        try {
            await ctx.editMessageReplyMarkup(markup)
            return true
        }
        catch(e) {
            Logging.warn(e)
            return false
        }
    }

    static async editText(ctx: Context, text: string, options?: ExtraEditMessageText): Promise<boolean> {
        try {
            await ctx.editMessageText(text, {parse_mode: PARSE_MODE, ...options})
            return true
        }
        catch(e) {
            Logging.warn(e)
            return false
        }
    }
}