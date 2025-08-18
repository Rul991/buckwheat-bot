import { Context } from 'telegraf'
import TimeUtils from './TimeUtils'
import Logging from './Logging'
import { ChatMember } from 'telegraf/types'
import { KICK_TIME } from './consts'

export default class AdminUtils {
    static async mute(ctx: Context, id: number, ms: number) {
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
            return await ctx.restrictChatMember(id, {
                permissions: {
                    can_send_messages: true,
                    can_send_other_messages: true,
                    can_invite_users: true,
                    can_send_polls: true,
                    can_add_web_page_previews: true,
                },
                until_date: 0
            })
        }
        catch(e) {
            Logging.error('cant unmute', e)
            return false
        }
    }

    static async ban(ctx: Context, id: number, ms: number): Promise<boolean> {
        try {
            return await ctx.banChatMember(id,  TimeUtils.getUntilDate(ms))
        }
        catch(e) {
            Logging.error('cant ban', e)
            return false
        }
    }

    static async kick(ctx: Context, id: number): Promise<boolean> {
        return await this.ban(ctx, id, KICK_TIME)
    }

    static async unban(ctx: Context, id: number) {
        try {
            return await ctx.unbanChatMember(id, {only_if_banned: true})
        }
        catch(e) {
            Logging.error('cant unban', e)
            return false
        }
    }
}