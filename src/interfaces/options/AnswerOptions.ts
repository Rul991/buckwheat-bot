import { InlineKeyboardButton } from 'telegraf/types'

export default interface AnswerOptions {
    inlineKeyboard?: InlineKeyboardButton[][]
    disableNotification?: boolean
    chatId?: number
    isReply?: boolean
}