import SettingValueService from "../../../db/services/settings/SettingValueService"
import { SettingValueTypes } from "../../../protos/settings_pb"
import type { BotContext } from "../../../types/bot"
import type { CommandStrings } from "../../../types/command"
import type { RankVars } from "../../../types/types"
import MessageUtils from "../../../utils/bot/MessageUtils"
import RankUtils from "../../../utils/db/RankUtils"
import MathUtils from "../../../utils/math/MathUtils"
import Setting from "../../../utils/settings/Setting"
import BaseAction from "./BaseAction"

export default abstract class RankedAction extends BaseAction {
    protected _lowRankKey: string = 'ranked/system/low-rank'
    protected _rankCanBeChange: boolean = true
    settingValueType: SettingValueTypes = SettingValueTypes.Command

    abstract minimumRank: number
    abstract settingId: number

    get rankSettings(): Setting<'enum', SettingValueTypes>[] {
        return [
            new Setting({
                type: 'enum',
                default: this.minimumRank.toString(),
                id: this.settingId,
                valueType: this.settingValueType,
                properties: {
                    values: this._rankCanBeChange ?
                        MathUtils.range(RankUtils.min, RankUtils.owner)
                            .map(v => v.toString()) :
                        []
                },
                textKey: 'action/ranked',
                vars: {
                    name: this.name,
                }
            })
        ]
    }

    protected async _getNeedRank(ctx: BotContext): Promise<number> {
        const setting = this.rankSettings[0]
        if (!setting) return this.minimumRank

        const id = ctx.vars.chatId!
        const settingValue = await SettingValueService.get({
            setting,
            id
        })

        return +(settingValue?.value ?? setting.default)
    }

    protected async _getRankVars(ctx: BotContext, chatId: number, rank: number): Promise<RankVars> {
        return RankUtils.getVars(ctx, chatId, rank)
    }

    async checkRank(ctx: BotContext): Promise<[boolean, number]> {
        if (ctx.vars.isOwner) return [true, this.minimumRank]

        const userRank = ctx.vars.user?.rank ?? RankUtils.min
        const needRank = await this._getNeedRank(ctx)

        return [
            RankUtils.has(
                userRank,
                needRank
            ),
            needRank
        ]
    }

    async sendLowRankMessage(ctx: BotContext, [botName, command]: CommandStrings, needRank: number): Promise<void> {
        const key = this._lowRankKey
        const chatId = ctx.vars.chatId!
        const userRank = ctx.vars.user?.rank ?? RankUtils.min

        await MessageUtils.reply(
            ctx,
            key,
            {
                vars: {
                    rank: {
                        need: await this._getRankVars(ctx, chatId, needRank),
                        user: await this._getRankVars(ctx, chatId, userRank),
                    },
                    botName,
                    command,
                    user: ctx.vars.user
                }
            }
        )
    }
}