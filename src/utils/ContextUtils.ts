import { Context } from 'telegraf'
import UserNameService from '../classes/db/services/user/UserNameService'
import MessageUtils from './MessageUtils'
import FileUtils from './FileUtils'
import { ChatMember } from 'telegraf/types'
import Logging from './Logging'
import LinkedChatService from '../classes/db/services/linkedChat/LinkedChatService'
import ExceptionUtils from './ExceptionUtils'
import { Link } from './values/types/types'
import { TextContext } from './values/types/contexts'

export default class ContextUtils {
    static async getUser(chatId?: number, id?: number, firstName?: string): Promise<Link> {
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

    static async answerPrecheckout(ctx: Context, ok: boolean, text?: string) {
        await ExceptionUtils.handle(async () => {
            await ctx.answerPreCheckoutQuery(ok, text)
        })
    }

    static async answerPrecheckoutFromResource(ctx: Context, ok: boolean, path?: string) {
        const text = path && await FileUtils.readPugFromResource(
            path
        )

        return await this.answerPrecheckout(ctx, ok, text)
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

        const { dice: { value: dice } } = await ctx.replyWithDice({
            emoji: '🎲'
        })

        return dice
    }

    static hasBotReply(ctx: TextContext) {
        const { reply_to_message: reply } = ctx.message
        return Boolean(reply?.from?.is_bot)
    }

    static getUserOrBotId(ctx: TextContext) {
        const isBot = this.hasBotReply(ctx)

        if (isBot) return ctx.message.reply_to_message!.from!.id
        return ctx.from.id
    }

    static getUserOrBotFirstName(ctx: TextContext) {
        const isBot = this.hasBotReply(ctx)

        if (isBot) return ctx.message.reply_to_message!.from!.first_name
        return ctx.from.first_name
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

    static async isAdmin(ctx: Context, id?: number): Promise<boolean> {
        const status = await this.getStatus(ctx, id)
        return status == 'creator' || status == 'administrator'
    }

    static async getStatus(ctx: Context, id?: number) {
        const user = await this.getChatMember(ctx, id)
        return user?.status ?? 'left'
    }

    static async isCreator(ctx: Context, id?: number): Promise<boolean> {
        const status = await this.getStatus(ctx, id)
        return status == 'creator'
    }

    static async getChatMember(ctx: Context, id?: number): Promise<ChatMember | null> {
        try {
            const user = await ctx.telegram.getChatMember(ctx.chat?.id ?? 0, id ?? ctx.from?.id ?? 0)
            return user
        }
        catch (e) {
            Logging.error(e)
            return null
        }
    }

    static async isLeft(ctx: Context, id: number) {
        const status = await this.getStatus(ctx, id)
        return status == 'kicked' || status == 'left'
    }

    static async showAlertIfIdNotEqual(ctx: Context, id: number): Promise<boolean> {
        if (id != ctx.from?.id) {
            await ContextUtils.showAlertFromFile(ctx)
            return true
        }
        return false
    }
}