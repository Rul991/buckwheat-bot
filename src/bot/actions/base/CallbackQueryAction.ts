import type { Message } from "@bufbuild/protobuf"
import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import type { CallbackQueryExecuteResult } from "../../../types/results"
import type { CallbackQueryActionOptions } from "../../../types/action-options"
import type { InlineKeyboardButton } from "grammy/types"
import { InlineKeyboard } from "grammy"
import type { CallbackQueryActionGetOptions } from "../../../types/options"
import PayloadConverter from "../../../utils/payload/PayloadConverter"
import RankedAction from "./RankedAction"
import Logger from "../../../utils/logs/Logger"
import { SettingValueTypes } from "../../../protos/settings_pb"
import type Setting from "../../../utils/settings/Setting"
import type { BotContext } from "../../../types/bot"
import type { CommandStrings } from "../../../types/command"
import AlertUtils from "../../../utils/bot/AlertUtils"
import RankUtils from "../../../utils/db/RankUtils"

export default abstract class CallbackQueryAction<T extends Record<string, any>> extends RankedAction {
    protected override _lowRankKey: string = 'button/low-rank'
    abstract schema: GenMessage<T & Message<any>>
    abstract defaultTextKey: string

    override settingValueType: SettingValueTypes = SettingValueTypes.Button
    protected abstract _execute(options: CallbackQueryActionOptions<T>): Promise<CallbackQueryExecuteResult>

    override get rankSettings(): Setting<"enum", SettingValueTypes>[] {
        const result = super.rankSettings
        const firstSetting = result[0]!
        firstSetting.textKey = `action/button/${this.name}`
        firstSetting.descriptionKey = 'action/button'

        return result
    }

    protected override async _getRankSetting(ctx: BotContext<T>): Promise<Setting<"enum", SettingValueTypes> | undefined> {
        return super._getRankSetting(ctx)
    }

    override async sendLowRankMessage(ctx: BotContext<T>, []: CommandStrings, needRank: number): Promise<void> {
        const chatId = ctx.vars.chatId!
        const user = await ctx.vars.user.get()
        const userRank = user?.rank ?? RankUtils.min
        const titleKey = this.rankSettings[0]?.titleKey

        await AlertUtils.alert(
            ctx,
            this._lowRankKey,
            {
                rank: {
                    user: await this._getRankVars(ctx, chatId, userRank),
                    need: await this._getRankVars(ctx, chatId, needRank),
                },
                name: titleKey ? ctx.t(titleKey) : ctx.t(this.defaultTextKey)
            }
        )
    }

    protected async _getId(_options: CallbackQueryActionOptions<T>): Promise<number | number[] | undefined> {
        return undefined
    }

    override async execute(options: CallbackQueryActionOptions<T>): Promise<CallbackQueryExecuteResult> {
        const {
            id
        } = options

        const getIdResult = await this._getId(options)
        const needIds = typeof getIdResult == 'number'
            ? [getIdResult]
            : typeof getIdResult == 'undefined'
                ? []
                : getIdResult

        const hasNeedId = needIds.length && needIds.every(v => v != id)
        Logger.system('CallbackQueryAction._getId', { needIds, id, hasNeedId })

        if (hasNeedId) {
            return {
                isAlert: true,
                key: 'cb-query/wrong-id'
            }
        }

        return await this._execute(options)
    }

    button({
        ctx,
        key = this.defaultTextKey,
        data,
        style,
        vars
    }: CallbackQueryActionGetOptions<T>): InlineKeyboardButton {
        return InlineKeyboard.text(
            {
                text: ctx.t(key, { ...data, ...vars }),
                style
            },
            PayloadConverter.encode({
                name: this.name,
                schema: this.schema,
                data
            })
        )
    }
}