import { InlineKeyboardMarkup, Message, ParseMode } from 'telegraf/types'
import { Context } from 'telegraf'
import InlineKeyboardManager from '../classes/main/InlineKeyboardManager'
import { MAX_MESSAGE_LENGTH, PARSE_MODE } from './consts'
import FileUtils from './FileUtils'
import Logging from './Logging'
import AnswerOptions from '../interfaces/options/AnswerOptions'
import FileAnswerOptions from '../interfaces/options/FileAnswerOptions'
import { ExtraEditMessageText } from './types'

export default class MessageUtils {
    static async answer(
        ctx: Context, 
        text: string, 
        {
            inlineKeyboard = ['empty', ''],
            disableNotification
        }: AnswerOptions = {}
    ): Promise<Message.TextMessage> {
        const emptyMessage: Message.TextMessage = {
            text: '', 
            message_id: -1, 
            date: -1, 
            chat: {
                first_name: '', 
                type: 'private', 
                id: -1
            }
        }
        
        if(!text.length) return emptyMessage

        const messageOptions = {
            reply_parameters: {'message_id': ctx.message?.message_id ?? 0},
            reply_markup: {
                inline_keyboard: await InlineKeyboardManager.get(...inlineKeyboard)
            },
            disable_notification: disableNotification
        }

        let lastMessage: Message.TextMessage = emptyMessage

        for (let i = 0; i < text.length; i += MAX_MESSAGE_LENGTH) {
            const partText = text.substring(i, i + MAX_MESSAGE_LENGTH)

            try {
                lastMessage = await ctx.reply(partText, {
                    ...messageOptions, 
                    parse_mode: PARSE_MODE
                })
            }
            catch(e) {
                Logging.error(e)
                lastMessage = await ctx.reply(partText, messageOptions)
            }
        }

        return lastMessage
    }

    static async todo(ctx: Context): Promise<Message.TextMessage> {
        return this.answer(ctx, 'Я еще не сделал это!')
    }

    static async answerMessageFromResource(
        ctx: Context, 
        path: string,
        options: FileAnswerOptions = {}
    ): Promise<Message.TextMessage> {
        const text = await FileUtils.readTextFromResource(path, options)

        return await this.answer(
            ctx, 
            text, 
            options
        )
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
            await ctx.editMessageText(text, options)
            return true
        }
        catch(e) {
            Logging.warn(e)
            return false
        }
    }
}