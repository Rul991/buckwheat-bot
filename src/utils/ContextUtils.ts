import { Context } from 'telegraf'
import { DEFAULT_USER_NAME } from './values/consts'
import UserNameService from '../classes/db/services/user/UserNameService'
import MessageUtils from './MessageUtils'
import { CallbackButtonContext } from './values/types'
import FileUtils from './FileUtils'
import { ChatMember } from 'telegraf/types'
import Logging from './Logging'

export default class ContextUtils {
    static async getUser(id?: number, firstName?: string) {
        const usedId = id ?? 0
        const name = await UserNameService.get(usedId) ?? firstName ?? DEFAULT_USER_NAME

        return {
            name,
            link: this.getLinkUrl(usedId)
        }
    }

    static async getUserFromContext(ctx: Context) {
        return await this.getUser(ctx.from?.id, ctx.from?.first_name)
    }

    static async sendDice(ctx: CallbackButtonContext, id: number): Promise<number> {
        const user = await ContextUtils.getUser(id)

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/cubes/drop.pug',
            {
                changeValues: user
            }
        )

        const {dice: {value: dice}} = await ctx.replyWithDice({
            emoji: '🎲'
        })

        return dice
    }

    static getLinkUrl(id: number): string {
        return `tg://user?id=${id}`
    }

    static async showAlert(ctx: Context, path = 'text/alerts/alert.pug') {
        await ctx.answerCbQuery(
            await FileUtils.readPugFromResource(path), 
            { show_alert: true }
        )
    }

    static async isCreator(ctx: Context): Promise<boolean> {
        const user = await this.getChatMember(ctx, ctx.from?.id ?? 0)
        return user?.status == 'creator'
    }

    static async getChatMember(ctx: Context, id: number): Promise<ChatMember | null> {
        try {
            const user = await ctx.telegram.getChatMember(ctx.chat?.id ?? 0, id)
            return user
        }
        catch(e) {
            Logging.error(e)
            return null
        }
    }
}