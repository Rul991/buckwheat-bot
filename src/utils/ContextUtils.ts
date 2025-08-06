import { Context } from 'telegraf'
import FileUtils from './FileUtils'
import { Message } from 'telegraf/types'
import { MaybeString } from './types'
import { DEFAULT_USER_NAME, PARSE_MODE } from './consts'

export default class ContextUtils {
    static async answerMessageFromResource(ctx: Context, path: string, changeValues: Record<string, string> = {}, isParseToHtmlEntities = true): Promise<Message.TextMessage> {
        return await ContextUtils.answer(ctx, await FileUtils.readTextFromResource(path, changeValues, isParseToHtmlEntities))
    }

    static getLinkUrl(id: number): string {
        return `tg://user?id=${id}`
    }

    static getLink(name: MaybeString, id: number): string {
        return `<a href="${this.getLinkUrl(id)}">${name ?? DEFAULT_USER_NAME}</a>`
    }

    static async answer(ctx: Context, text: string): Promise<Message.TextMessage> {
        if(!text.length) return {text: '', message_id: -1, date: -1, chat: {first_name: '', type: 'private', 'id': -1}}

        const options = {reply_parameters: {'message_id': ctx.message?.message_id ?? 0}}

        try {
            return await ctx.reply(text, {...options, parse_mode: PARSE_MODE})
        }
        catch(e) {
            console.error(e)
            return await ctx.reply(text, options)
        }
    }

    static async isCreator(ctx: Context): Promise<boolean> {
        const user = await ctx.telegram.getChatMember(ctx.chat?.id!, ctx.from?.id!)
        return user.status == 'creator'
    }
}