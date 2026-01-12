import { Context } from 'telegraf'
import TimeUtils from './TimeUtils'
import Logging from './Logging'
import LinkedChatService from '../classes/db/services/linkedChat/LinkedChatService'
import UserLeftService from '../classes/db/services/user/UserLeftService'
import ExceptionUtils from './ExceptionUtils'

export default class AdminUtils {
    private static async _setLeft(ctx: Context, id: number, value: boolean) {
        const chatId = await LinkedChatService.getCurrent(ctx, id)
        if(chatId) {
            await UserLeftService.update(chatId, id, value)
        }
    }

    static async mute(ctx: Context, id: number, ms: number = 0) {
        try {
            return await ctx.restrictChatMember(id, {
                permissions: {
                    can_send_messages: false,
                    can_send_other_messages: false
                },
                until_date: TimeUtils.getUntilDate(ms)
            })
        }
        catch(e) {
            Logging.error('cant mute', e)
            return false
        }
    }

    static async unmute(ctx: Context, id: number) {
        try {
            return await ctx.promoteChatMember(id, {})
        }
        catch(e) {
            Logging.error('cant unmute', e)
            return false
        }
    }

    static async ban(ctx: Context, id: number, ms: number): Promise<boolean> {
        try {
            const isRestricted = await ctx.banChatMember(id,  TimeUtils.getUntilDate(ms))
            if(isRestricted) await this._setLeft(ctx, id, true)
            return isRestricted
        }
        catch(e) {
            Logging.error('cant ban', e)
            return false
        }
    }

    static async kick(ctx: Context, id: number): Promise<boolean> {
        const isRestricted = await this.unban(ctx,  id, false)
        if(isRestricted) await this._setLeft(ctx, id, true)
        return isRestricted
    }

    static async unban(ctx: Context, id: number, onlyIfBanned = true) {
        try {
            return await ctx.unbanChatMember(id, {only_if_banned: onlyIfBanned})
        }
        catch(e) {
            Logging.error('cant unban', e)
            return false
        }
    }

    private static _getMessageId(ctx: Context) {
        return ctx.message ? 
            'reply_to_message' in ctx.message ?
                ctx.message.reply_to_message?.message_id :
                ctx.message.message_id
            : undefined
    }

    static async pin(ctx: Context) {
        const messageId = this._getMessageId(ctx)
        if(!messageId) return false

        return await ExceptionUtils.handle(async () => {
            await ctx.pinChatMessage(messageId)
        })
    }

    static async unpin(ctx: Context) {
        const messageId = this._getMessageId(ctx)
        if(!messageId) return false

        return await ExceptionUtils.handle(async () => {
            await ctx.unpinChatMessage(messageId)
        })
    }
}