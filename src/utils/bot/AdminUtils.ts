import SettingValueService from "../../db/services/settings/SettingValueService"
import type { SettingValueTypes } from "../../protos/settings_pb"
import { gameKickSetting } from "../../resources/settings/chat"
import type { BotContext } from "../../types/bot"
import ExceptionUtils from "../exceptions/ExceptionUtils"
import type Setting from "../settings/Setting"
import TimeUtils from "../time/TimeUtils"

type GameKickOptions = {
    ctx: BotContext
    chatId: number
    id: number
    setting?: Setting<'boolean', SettingValueTypes.Chat>
}

export default class AdminUtils {
    private static _isBuckwheat(ctx: BotContext, id: number): boolean {
        return ctx.me.id == id
    }

    static async unban(ctx: BotContext, id: number, onlyIfBanned = true): Promise<boolean> {
        if (this._isBuckwheat(ctx, id)) return false

        return ExceptionUtils.handleAsync(
            async () => {
                return await ctx.unbanChatMember(
                    id,
                    {
                        only_if_banned: onlyIfBanned
                    }
                )
            },
            false
        )
    }

    static kick(ctx: BotContext, id: number): Promise<boolean> {
        return this.unban(ctx, id, false)
    }

    static async gameKick({
        ctx,
        chatId,
        id,
        setting = gameKickSetting
    }: GameKickOptions): Promise<boolean> {
        const canKickSettingValue = await SettingValueService.get({
            setting,
            id: chatId
        })

        const canKick = canKickSettingValue.value
        if (!canKick) return false

        return await this.kick(ctx, id)
    }

    static async ban(ctx: BotContext, id: number, ms: number): Promise<boolean> {
        if (this._isBuckwheat(ctx, id)) return false

        return ExceptionUtils.handleAsync(
            async () => {
                const untilDate = TimeUtils.getUntilDateInSeconds(ms)
                return await ctx.banChatMember(
                    id,
                    {
                        until_date: untilDate
                    }
                )
            },
            false
        )
    }

    static async mute(ctx: BotContext, id: number, ms: number): Promise<boolean> {
        if (this._isBuckwheat(ctx, id)) return false

        return ExceptionUtils.handleAsync(
            async () => {
                const untilDate = TimeUtils.getUntilDateInSeconds(ms)
                return await ctx.restrictChatMember(
                    id,
                    {
                        can_add_web_page_previews: false,
                        can_change_info: false,
                        can_edit_tag: false,
                        can_invite_users: false,
                        can_manage_topics: false,
                        can_pin_messages: false,
                        can_react_to_messages: false,
                        can_send_audios: false,
                        can_send_documents: false,
                        can_send_messages: false,
                        can_send_other_messages: false,
                        can_send_photos: false,
                        can_send_polls: false,
                        can_send_video_notes: false,
                        can_send_videos: false,
                        can_send_voice_notes: false
                    },
                    {
                        until_date: untilDate
                    }
                )
            },
            false
        )
    }

    static async unmute(ctx: BotContext, id: number): Promise<boolean> {
        if (this._isBuckwheat(ctx, id)) return false

        return ExceptionUtils.handleAsync(
            async () => {
                return await ctx.promoteChatMember(
                    id,
                )
            },
            false
        )
    }

    static async setAdminTag(ctx: BotContext, id: number, tag: string): Promise<boolean> {
        return await ExceptionUtils.handleAsync(
            async () => {
                const isPromote = await ctx.promoteChatMember(
                    id,
                    {
                        can_manage_chat: !!tag.length
                    }
                )
                
                const isSetTag = await ctx.setChatMemberTag(
                    id,
                    tag
                )

                return isSetTag && isPromote
            },
            false
        )
    }
}