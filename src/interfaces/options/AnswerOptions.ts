import { ForceReply, InlineKeyboardButton, InlineKeyboardMarkup, ReplyKeyboardMarkup, ReplyKeyboardRemove } from 'telegraf/types'

export default interface AnswerOptions {
    inlineKeyboard?: InlineKeyboardButton[][]
    disableNotification?: boolean
    chatId?: number
    isReply?: boolean
    replyMarkup?: (InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply)
}