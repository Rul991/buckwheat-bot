import { InlineKeyboard } from "grammy"
import type { DefaultSetting } from "../../types/settings"
import KeyboardCreator from "../../utils/keyboard/KeyboardCreator"
import SettingUtils from "../../utils/settings/SettingUtils"
import SettingScrollerButton from "../actions/callback-query/settings/SettingScrollerButton"
import SettingSetButton from "../actions/callback-query/settings/SettingSetButton"
import ArrayUtils from "../../utils/math/ArrayUtils"

export const settingShowKeyboard = KeyboardCreator.create<{
    userId: number,
    setting: DefaultSetting,
    page: number
}>(
    async ({
        ctx,
        data,
        keyboard
    }) => {
        const {
            userId,
            setting,
            page
        } = data
        const bigId = BigInt(userId)
        const valueKeyboard = new InlineKeyboard()
        const values = 'values' in setting.properties ?
            ArrayUtils.range(0, setting.properties.values.length - 1) :
            setting.type == 'boolean' ?
                [1, 0] :
                [0]

        for (const value of values) {
            valueKeyboard.add(
                SettingSetButton.button({
                    ctx,
                    data: {
                        id: bigId,
                        type: setting.valueType,
                        settingId: setting.id,
                        value
                    },
                    vars: {
                        setting: {
                            ...setting,
                            ...setting.getVars(ctx),
                            value
                        }
                    }
                })
            )
        }

        keyboard.append(
            valueKeyboard.toFlowed(4)
        )
        keyboard.row()
        keyboard.add(
            SettingScrollerButton.button({
                ctx,
                key: 'button/back',
                data: {
                    type: setting.valueType,
                    data: {
                        $typeName: 'ScrollerData',
                        data: {
                            case: 'page',
                            value: page
                        },
                        id: bigId
                    }
                }
            })
        )
    }
)

export const settingStartKeyboard = KeyboardCreator.create<{

}>(
    async ({
        ctx,
        keyboard
    }) => {
        const types = SettingUtils.types
        const userId = BigInt(ctx.vars.id!)

        for (const type of types) {
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