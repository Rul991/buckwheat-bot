import { Context } from 'telegraf'
import { DEFAULT_USER_NAME } from './values/consts'
import UserNameService from '../classes/db/services/user/UserNameService'
import MessageUtils from './MessageUtils'
import FileUtils from './FileUtils'
import { ChatMember } from 'telegraf/types'
import Logging from './Logging'
import LinkedChatService from '../classes/db/services/linkedChat/LinkedChatService'
import ExceptionUtils from './ExceptionUtils'

export default class ContextUtils {
    static async getUser(chatId?: number, id?: number, firstName?: string) {
        const usedId = id ?? 0
        const usedChatId = chatId ?? 0

        const name = await UserNameService.get(
            usedChatId,
            usedId
        )

        return {
            name,
            link: this.getLinkUrl(usedId)
        }
    }

    static async getUserFromContext(ctx: Context) {
        const chatId = await LinkedChatService.getCurrent(ctx)
        return await this.getUser(chatId ?? undefined, ctx.from?.id, ctx.from?.first_name)
    }

    static async sendDice(ctx: Context, id: number): Promise<number> {
        const user = await ContextUtils.getUser(ctx.chat?.id, id)

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

    static async showCallbackMessage(ctx: Context, text: string, isAlert = false): Promise<boolean> {
        return await ExceptionUtils.handle(async () => {
            await ctx.answerCbQuery(
                text, 
                { show_alert: isAlert }
            )
        })
    }

    static async showCallbackMessageFromFile(ctx: Context, path = 'text/alerts/alert.pug', isAlert = false) {
        await this.showCallbackMessage(
            ctx, 
            await FileUtils.readPugFromResource(path), 
            isAlert
        )
    }

    static async showAlertFromFile(ctx: Context, path?: string) {
        await this.showCallbackMessageFromFile(ctx, path, true)
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