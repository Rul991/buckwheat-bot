import { Context } from 'telegraf'
import { DEFAULT_USER_NAME } from './consts'
import UserNameService from '../classes/db/services/user/UserNameService'
import MessageUtils from './MessageUtils'
import { CallbackButtonContext } from './types'
import FileUtils from './FileUtils'

export default class ContextUtils {
    static async getUser(id?: number, firstName?: string) {
        const usedId = id ?? 0
        const name = await UserNameService.get(usedId) ?? firstName ?? DEFAULT_USER_NAME

        return {
            name,
            link: this.getLinkUrl(usedId)
        }
    }

    static async sendDice(ctx: CallbackButtonContext, id: number): Promise<number> {
        const user = await ContextUtils.getUser(id)

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/cubes/drop.html',
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
            await FileUtils.readTextFromResource(path), 
            { show_alert: true }
        )
    }

    static async isCreator(ctx: Context): Promise<boolean> {
        const user = await ctx.telegram.getChatMember(ctx.chat?.id!, ctx.from?.id!)
        return user.status == 'creator'
    }
}