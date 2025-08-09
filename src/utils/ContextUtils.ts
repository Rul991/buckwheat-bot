import { Context } from 'telegraf'
import FileUtils from './FileUtils'
import { Message } from 'telegraf/types'
import { MaybeString } from './types'
import { DEFAULT_USER_NAME, PARSE_MODE } from './consts'
import Logging from './Logging'
import InlineKeyboardManager from '../classes/main/InlineKeyboardManager'

export default class ContextUtils {
    static getLinkUrl(id: number): string {
        return `tg://user?id=${id}`
    }

    static getLink(name: MaybeString, id: number): string {
        return `<a href="${this.getLinkUrl(id)}">${name ?? DEFAULT_USER_NAME}</a>`
    }

    static async showAlert(ctx: Context) {
        await ctx.answerCbQuery('Убери свои шалавливые ручки!', {show_alert: true})
    }

    static async isCreator(ctx: Context): Promise<boolean> {
        const user = await ctx.telegram.getChatMember(ctx.chat?.id!, ctx.from?.id!)
        return user.status == 'creator'
    }
}