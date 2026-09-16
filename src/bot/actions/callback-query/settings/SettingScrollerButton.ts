import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { SettingsScrollerDataSchema, type SettingsScrollerData } from "../../../../protos/settings_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { ScrollerButtonEditMessageOptions } from "../../../../types/options"
import type { ScrollerButtonEditMessageResult } from "../../../../types/results"
import type { DefaultSetting } from "../../../../types/settings"
import ScrollerButton from "../scroller/ScrollerButton"
import RankUtils from "../../../../utils/db/RankUtils"
import { InlineKeyboard } from "grammy"
import SettingUtils from "../../../../utils/settings/SettingUtils"
import SettingValueService from "../../../../db/services/settings/SettingValueService"
import SettingShowButton from "./SettingShowButton"
import Logger from "../../../../utils/logs/Logger"

type Object = DefaultSetting

class SettingScrollerButton extends ScrollerButton<Object, SettingsScrollerData> {
    override schema: GenMessage<SettingsScrollerData> = SettingsScrollerDataSchema
    override minimumRank: number = RankUtils.min
    override settingId: number = 35
    override name: string = 'stscr'
    protected override _objectsPerPage: number = 7
    protected override _isNeedCache: boolean = false

    protected override async _getRawObjects(options: CallbackQueryActionOptions<SettingsScrollerData>): Promise<Object[]> {
        const {
            data
        } = options

        const {
            type,
        } = data

        return SettingUtils.getAll(type)
    }

    protected override async _getControlsButtonData(options: ScrollerButtonEditMessageOptions<DefaultSetting, SettingsScrollerData>): Promise<Omit<SettingsScrollerData, "data" | "$typeName" | "$unknown">> {
        const {
            data: {
                id,
                type
            }
        } = options

        return {
            id,
            type
        }
    }

    protected override async _getKeyboard(options: ScrollerButtonEditMessageOptions<Object, SettingsScrollerData>): Promise<InlineKeyboard> {
        const {
            slicedObjects,
            data: {
                type,
                id: rawSettingOwnerId
            },
            ctx,
            id,
            objects
        } = options

        Logger.debug(
            'SettingScrollerButton._getKeyboard',
            {
                type,
                objects
            }
        )

        const keyboard = new InlineKeyboard()
        const userId = BigInt(id)
        const settingOwnerId = Number(rawSettingOwnerId)

        const settingValues = await SettingValueService.getBySettings(
            settingOwnerId,
            slicedObjects
        )

        for (const setting of slicedObjects) {
            const settingValue = settingValues.get(
                setting.id
            )
            const value = settingValue?.value ?? setting.default
            const id = BigInt(setting.id)

            keyboard.row()
            keyboard.add(
                SettingShowButton.button({
                    ctx,
                    data: {
                        id,
                        settingId: setting.id,
                        type: setting.valueType,
                        userId
                    },
                    key: 'setting/show-button',
                    vars: {
                        setting: {
                            ...setting,
                            title: ctx.t(
                                setting.titleKey,
                                {
                                    setting: {
                                        ...setting,
                                        value,
                                    }
                                }
                            ),
                            value
                        }
                    }
                })
            )
        }

        return keyboard
    }

    protected override async _editMessage(options: ScrollerButtonEditMessageOptions<Object, SettingsScrollerData>): Promise<ScrollerButtonEditMessageResult> {
        const {

        } = options

        return {
            key: 'setting/start'
        }
    }
}

export default new SettingScrollerButton()