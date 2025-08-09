import { Message } from 'telegraf/types'
import { Context } from 'telegraf'
import InlineKeyboardManager from '../classes/main/InlineKeyboardManager'
import { PARSE_MODE } from './consts'
import FileUtils from './FileUtils'
import Logging from './Logging'
import AnswerOptions from '../interfaces/options/AnswerOptions'
import FileAnswerOptions from '../interfaces/options/FileAnswerOptions'

export default class MessageUtils {
    static async answer(
        ctx: Context, 
        text: string, 
        {inlineKeyboard = ['empty', '']}: AnswerOptions = {}
    ): Promise<Message.TextMessage> {
        if(!text.length) return {text: '', message_id: -1, date: -1, chat: {first_name: '', type: 'private', 'id': -1}}

        const messageOptions = {
            reply_parameters: {'message_id': ctx.message?.message_id ?? 0},
            reply_markup: {
                inline_keyboard: await InlineKeyboardManager.get(...inlineKeyboard)
            }
        }

        try {
            return await ctx.reply(text, {
                ...messageOptions, 
                parse_mode: PARSE_MODE
            })
        }
        catch(e) {
            Logging.error(e)
            return await ctx.reply(text, messageOptions)
        }
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
}