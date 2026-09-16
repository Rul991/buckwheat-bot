import type { ChatMember } from "grammy/types"
import { DEV_ID } from "../../consts/env"
import type { BotContext } from "../../types/bot"
import type { RankVars } from "../../types/types"
import Logger from "../logs/Logger"
import SettingValueService from "../../db/services/settings/SettingValueService"
import { ranksSettings } from "../../resources/settings/ranks"
import MathUtils from "../math/MathUtils"

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
                    buckwheat: ctx.me.id
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

    static async getRankName(ctx: BotContext, chatId: number, rank: number) {
        const rankSettingValue = await SettingValueService.get({
            setting: ranksSettings[rank] || ranksSettings[1]!,
            id: chatId
        })
        return ctx.t(
            'rank/name',
            {
                name: rankSettingValue.value,
                rank
            }
        )
    }

    static async getVars(ctx: BotContext, chatId: number, rank: number): Promise<RankVars> {
        return {
            value: rank,
            name: await this.getRankName(ctx, chatId, rank),
            emoji: this.getEmojiByRank(ctx, rank)
        }
    }

    static has(userRank: number, needRank: number) {
        Logger.debug('RankUtils.has', { userRank, needRank })
        return userRank >= needRank
    }

    static canUseWithoutRank(chatMember: ChatMember | undefined, id: number) {
        return DEV_ID == id || chatMember?.status == 'creator'
    }
}