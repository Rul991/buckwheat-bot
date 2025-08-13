import { Context } from 'telegraf'
import { DEFAULT_USER_NAME } from './consts'
import UserNameService from '../classes/db/services/user/UserNameService'

export default class ContextUtils {
    static async getUser(id?: number, firstName?: string) {
        const usedId = id ?? 0
        const name = await UserNameService.get(usedId) ?? firstName ?? DEFAULT_USER_NAME

        return {
            name,
            link: this.getLinkUrl(usedId)
        }
    }

    static getLinkUrl(id: number): string {
        return `tg://user?id=${id}`
    }

    static async showAlert(ctx: Context) {
        await ctx.answerCbQuery('Убери свои шалавливые ручки!', {show_alert: true})
    }

    static async isCreator(ctx: Context): Promise<boolean> {
        const user = await ctx.telegram.getChatMember(ctx.chat?.id!, ctx.from?.id!)
        return user.status == 'creator'
    }
}