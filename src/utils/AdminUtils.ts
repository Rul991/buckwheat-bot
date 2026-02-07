import { Context, Types } from 'telegraf'
import TimeUtils from './TimeUtils'
import Logging from './Logging'
import ExceptionUtils from './ExceptionUtils'
import { KICK_TIME } from './values/consts'
import { Ids } from './values/types/types'
import ChatSettingsService from '../classes/db/services/settings/ChatSettingsService'

type GameKickOptions = Ids & {
    ctx: Context
    isLongKick?: boolean
}

export default class AdminUtils {
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
        catch (e) {
            Logging.error('cant mute', e)
            return false
        }
    }

    static async unmute(ctx: Context, id: number) {
        try {
            return await ctx.promoteChatMember(id, {})
        }
        catch (e) {
            Logging.error('cant unmute', e)
            return false
        }
    }

    static async ban(ctx: Context, id: number, ms: number): Promise<boolean> {
        try {
            const isRestricted = await ctx.banChatMember(id, TimeUtils.getUntilDate(ms))
            return isRestricted
        }
        catch (e) {
            Logging.error('cant ban', e)
            return false
        }
    }

    static async kick(ctx: Context, id: number): Promise<boolean> {
        return await this.unban(ctx, id, false)
    }

    static async longKick(ctx: Context, id: number) {
        return await this.ban(ctx, id, KICK_TIME)
    }

    static async gameKick({
        ctx,
        chatId,
        id,
        isLongKick = false
    }: GameKickOptions) {
        const isKick = await ChatSettingsService.get<'boolean'>(
            chatId,
            'gameKick'
        )

        if (isKick) {
            if (isLongKick) {
                return await this.longKick(ctx, id)
            }
            else {
                return await this.kick(ctx, id)
            }
        }

        return isKick
    }

    static async unban(ctx: Context, id: number, onlyIfBanned = true) {
        try {
            return await ctx.unbanChatMember(id, { only_if_banned: onlyIfBanned })
        }
        catch (e) {
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
        if (!messageId) return false

        return await ExceptionUtils.handle(async () => {
            await ctx.pinChatMessage(messageId)
        })
    }

    static async unpin(ctx: Context) {
        const messageId = this._getMessageId(ctx)
        if (!messageId) return false

        return await ExceptionUtils.handle(async () => {
            await ctx.unpinChatMessage(messageId)
        })
    }

    /**
     * 
     * @param title 0-16 symbols
     */
    static async setAdminTitle(ctx: Context, id: number, title: string) {
        return await ExceptionUtils.handle(async () => {
            const isAdmin = title.length > 0
            await ctx.promoteChatMember(
                id,
                {
                    can_manage_chat: isAdmin
                }
            )
            
            if(!isAdmin) return
            await ctx.setChatAdministratorCustomTitle(
                id,
                title
            )
        })
    }
}