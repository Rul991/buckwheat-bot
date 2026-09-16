import { SettingValueTypes } from "../../protos/settings_pb"
import type { DefaultSetting } from "../../types/settings"
import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import SettingUtils from "../../utils/settings/SettingUtils"
import SettingScrollerButton from "../actions/callback-query/settings/SettingScrollerButton"

export const settingShowKeyboard = KeyboardCreator.create<{
    settingOwnerId: number,
    userId: number,
    setting: DefaultSetting
}>(
    async ({
        // ctx,
        data,
        // keyboard
    }) => {
        const {
            // id,
            // setting
        } = data
    }
)

export const settingStartKeyboard = KeyboardCreator.create<{

}>(
    async ({
        ctx,
        keyboard
    }) => {
        const isChatSettingType: Record<SettingValueTypes, boolean> = {
            [SettingValueTypes.User]: false,
            [SettingValueTypes.Chat]: true,
            [SettingValueTypes.Command]: true,
            [SettingValueTypes.Button]: true,
            [SettingValueTypes.Ranks]: true
        }
        const types = SettingUtils.types
        const userId = BigInt(ctx.vars.id!)
        
        for (const type of types) {
            const id = BigInt(isChatSettingType[type] ? ctx.vars.chatId! : userId)
            keyboard.row()
            keyboard.add(
                SettingScrollerButton.button({
                    ctx,
                    data: {
                        data: {
                            data: {
                                case: 'update',
                                value: false
                            },
                            id: userId,
                            $typeName: 'ScrollerData'
                        },
                        id,
                        type
                    },
                    key: 'settings/types',
                    vars: {
                        type
                    }
                })
            )
        }
    }
)