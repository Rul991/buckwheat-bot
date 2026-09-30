import type { ChatMember } from "grammy/types"
import { DEV_ID, MOMMY_ID } from "../../consts/env"
import type { BotContext } from "../../types/bot"
import type { RankVars } from "../../types/types"
import Logger from "../logs/Logger"
import SettingValueService from "../../db/services/settings/SettingValueService"
import { ranksSettings } from "../../resources/settings/ranks"
import MathUtils from "../math/MathUtils"
import SettingValue from "../../db/entities/settings/SettingValue"
import { SettingValueTypes } from "../../protos/settings_pb"

export default class RankUtils {
    static min = 0
    static unknown = this.min - 1
    static max = 5
    static owner = this.max + 1

    static admin = this.max - 1
    static moderator = this.max - 2

    static isClamp(rank: number): boolean {
        return MathUtils.isClamp(rank, this.unknown, this.max)
    }

    static clamp(rank: number): number {
        return MathUtils.clamp(rank, this.unknown, this.max)
    }

    static getEmojiByRank(ctx: BotContext, rank: number): string {
        return ctx.t('rank/emoji', { rank })
    }

    static getStatusByRank(ctx: BotContext, id: number, rank: number): string {
        return ctx.t(
            'rank/status',
            {
                id: {
                    current: id,
                    dev: DEV_ID,
                    buckwheat: ctx.me.id,
                    mommy: MOMMY_ID
                },
                ranks: {
                    current: rank,
                    min: this.min,
                    moderator: this.moderator,
                    admin: this.admin,
                    max: this.max,
                },
            }
        )
    }

    private static _getRankNameBySettingValue(ctx: BotContext, settingValue: SettingValue<'string', SettingValueTypes.Ranks>): string {
        const rank = settingValue.settingId - 1
        const name = settingValue.value
        Logger.debug(
            'RankUtils._getRankNameBySettingValue',
            {
                settingValue,
                rank,
                name
            }
        )
        return this.getDefaultRankName(ctx, rank, name)
    }

    static async getRankName(ctx: BotContext, chatId: number, rank: number) {
        const zeroRankIndex = -2
        const index = ranksSettings.length + zeroRankIndex - rank

        const rankSetting = ranksSettings[index]

        const rankSettingValue = rankSetting ?
            await SettingValueService.get({
                setting: rankSetting,
                id: chatId
            }) :
            undefined
        return this._getRankNameBySettingValue(
            ctx,
            rankSettingValue ?? {
                id: chatId,
                settingId: rank + 1,
                value: '',
                valueType: SettingValueTypes.Ranks
            }
        )
    }

    static getDefaultRankName(ctx: BotContext, rank: number, name?: string): string {
        const result = ctx.t(
            'rank/name',
            {
                name: name ?? '',
                rank
            }
        )

        Logger.debug(
            'RankUtils.getDefaultRankName',
            {
                result,
                rank,
                name
            }
        )
        return result
    }

    static getDefaultVars(ctx: BotContext, rank: number): RankVars {
        return {
            value: rank,
            name: this.getDefaultRankName(ctx, rank),
            emoji: this.getEmojiByRank(ctx, rank)
        }
    }

    static async getVars(ctx: BotContext, chatId: number, rank: number): Promise<RankVars> {
        return {
            value: rank,
            name: await this.getRankName(ctx, chatId, rank),
            emoji: this.getEmojiByRank(ctx, rank)
        }
    }

    static async getVarsEvery(
        ctx: BotContext,
        chatId: number,
    ): Promise<Map<number, RankVars>> {
        const settings = ranksSettings
        const settingValues = await SettingValueService.getBySettings(chatId, settings)

        const result = new Map<number, RankVars>()
        for (const [settingId, settingValue] of settingValues) {
            const rank = settingId - 1
            result.set(
                rank,
                {
                    value: rank,
                    name: this._getRankNameBySettingValue(
                        ctx,
                        settingValue
                    ),
                    emoji: this.getEmojiByRank(ctx, rank)
                }
            )
        }
        return result
    }

    static has(userRank: number, needRank: number) {
        Logger.debug('RankUtils.has', { userRank, needRank })
        return userRank >= needRank
    }

    static canUseWithoutRank(chatMember: ChatMember | undefined, id: number) {
        return DEV_ID == id || chatMember?.status == 'creator'
    }
}