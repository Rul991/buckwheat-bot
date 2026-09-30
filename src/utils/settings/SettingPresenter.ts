import type { InlineKeyboardMarkup } from "grammy/types"
import { settingShowKeyboard } from "../../bot/keyboards/settings"
import type SettingValue from "../../db/entities/settings/SettingValue"
import type { SettingValueTypes } from "../../protos/settings_pb"
import type { BotContext } from "../../types/bot"
import type { SettingTypes } from "../../types/settings"
import type Setting from "./Setting"

type ShowOptions =
    & {
        ctx: BotContext
        setting: Setting<SettingTypes, SettingValueTypes>
        settingValue: SettingValue<SettingTypes, SettingValueTypes>
    }
    & (
        | {
            keyboard: InlineKeyboardMarkup
        }
        | {
            page: number
            userId: number
        }
    )

export default class SettingPresenter {
    static async show(data: ShowOptions) {
        const {
            ctx,
            setting,
            settingValue,
        } = data

        return {
            key: 'setting/show/message',
            options: {
                vars: {
                    setting: {
                        ...setting,
                        ...setting.getVars(ctx),
                        value: setting.getShowableValue(ctx, settingValue.value),
                    },
                    ...(
                        'min' in setting.properties ? {
                            min: setting.getShowableValue(ctx, setting.properties.min),
                            max: setting.getShowableValue(ctx, setting.properties.max),
                        } : {}
                    )
                },
                keyboard: 'keyboard' in data ?
                    data.keyboard :
                    await settingShowKeyboard(
                        ctx,
                        {
                            setting,
                            page: data.page,
                            userId: data.userId
                        }
                    )
            }
        }
    }
}