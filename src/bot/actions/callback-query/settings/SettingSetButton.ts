import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type SettingSetButtonData, SettingSetButtonDataSchema, SettingValueTypes } from "../../../../protos/settings_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import SettingUtils from "../../../../utils/settings/SettingUtils"
import type { SettingTypes, SettingTypeToProperties } from "../../../../types/settings"
import type { CallbackQueryContext } from "../../../../types/contexts"
import Setting from "../../../../utils/settings/Setting"
import SettingValueService from "../../../../db/services/settings/SettingValueService"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import SettingPresenter from "../../../../utils/settings/SettingPresenter"
import type { BotContext } from "../../../../types/bot"
import SetDateSettingConversation from "../../conversations/setting/SetDateSettingConversation"
import SetNumberSettingConversation from "../../conversations/setting/SetNumberSettingConversation"
import SetStringSettingConversation from "../../conversations/setting/SetStringSettingConversation"

type SetOptions = {
    ctx: CallbackQueryContext<SettingSetButtonData>
    settingOwnerId: number
    value: string | boolean
    setting: Setting<SettingTypes, SettingValueTypes>
}

class SettingSetButton extends CallbackQueryAction<SettingSetButtonData> {
    override schema: GenMessage<SettingSetButtonData> = SettingSetButtonDataSchema
    override defaultTextKey: string = 'setting/set/button'
    override minimumRank: number = RankUtils.max
    override settingId: number = 111
    override name: string = 'stset'

    protected override async _getRankSetting(ctx: BotContext<SettingSetButtonData>): Promise<Setting<"enum", SettingValueTypes> | undefined> {
        const valueType = ctx.actionData.type
        const isChat = SettingUtils.isChat(valueType)
        if(isChat) {
            return super._getRankSetting(ctx)
        }

        return new Setting({
            type: 'enum',
            valueType: SettingValueTypes.Button,
            textKey: '',
            id: this.settingId + 1000,
            default: RankUtils.min.toString(),
            properties: {
                values: []
            }
        })
    }

    private async _set({
        ctx,
        settingOwnerId,
        value,
        setting
    }: SetOptions): Promise<CallbackQueryExecuteResult> {
        const keyboard = ctx.msg!.reply_markup!

        const settingValue = await SettingValueService.set({
            setting,
            value,
            id: settingOwnerId
        })
        if(!settingValue) return

        const {
            key,
            options
        } = await SettingPresenter.show({
            ctx,
            keyboard,
            setting,
            settingValue
        })

        await MessageUtils.editText(
            ctx,
            key,
            options
        )

        return {
            key: 'setting/set/set',
            vars: {
                value
            }
        }
    }

    protected override async _getId(options: CallbackQueryActionOptions<SettingSetButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }

    protected override async _execute(options: CallbackQueryActionOptions<SettingSetButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            id,
            chatId,
            ctx
        } = options

        const {
            settingId,
            type,
            value,
        } = data

        const setting = SettingUtils.get(
            type,
            settingId
        )
        if (!setting) {
            return {
                key: 'setting/set/not-exist',
                vars: {
                    type: 'setting'
                }
            }
        }

        const settingOwnerId = SettingUtils.isChat(setting) ?
            chatId :
            id

        const conversationData = {
            settingId,
            valueType: setting.valueType,
            settingOwnerId,
        }

        if (setting.type == 'date') {
            return await SetDateSettingConversation.enter(ctx, conversationData)
        }
        else if (setting.type == 'number') {
            return await SetNumberSettingConversation.enter(ctx, conversationData)
        }
        else if (setting.type == 'string') {
            return await SetStringSettingConversation.enter(ctx, conversationData)
        }
        else if (setting.type == 'boolean') {
            const result = !!value
            return await this._set({
                settingOwnerId,
                setting,
                ctx,
                value: result
            })
        }
        else if (setting.type == 'enum') {
            const result = (setting.properties as SettingTypeToProperties['enum']).values[value]
            if (result === undefined) {
                return {
                    key: 'setting/set/not-exist',
                    vars: {
                        type: 'variant'
                    }
                }
            }

            return await this._set({
                settingOwnerId,
                setting,
                ctx,
                value: result
            })
        }

        return {
            key: 'setting/set/not-exist',
            vars: {
                type: 'type'
            }
        }
    }
}

export default new SettingSetButton()