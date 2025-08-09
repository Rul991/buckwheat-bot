import { Context } from 'telegraf'

export default class AdminUtils {
    static async mute() {

    }

    static async unmute() {
        
    }

    static async ban(ctx: Context, id: number, ms: number): Promise<boolean> {
        try {
            return await ctx.banChatMember(id,  (ms + Date.now()) / 1000)
        }
        catch {
            return false
        }
    }

    static async unban() {
        
    }
}