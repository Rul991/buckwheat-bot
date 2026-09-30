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
import SettingBackButton from "./SettingBackButton"

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
                type
            }
        } = options

        return {
            type
        }
    }

    protected override async _getKeyboard(options: ScrollerButtonEditMessageOptions<Object, SettingsScrollerData>): Promise<InlineKeyboard> {
        const {
            slicedObjects,
            data: {
                type,
            },
            ctx,
            id,
            objects,
            page,
            chatId
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
        const isChat = SettingUtils.isChat(type)
        const settingOwnerId = Number(isChat ? chatId : id)

        const settingValues = await SettingValueService.getBySettings(
            settingOwnerId,
            slicedObjects
        )

        Logger.debug(
            'SettingScrollerButton._getKeyboard',
            {
                settingValues
            }
        )

        keyboard.add(
            SettingBackButton.button({
                ctx,
                data: {
                    id: userId
                },
            })
        )

        for (const setting of slicedObjects) {
            const settingValue = settingValues.get(
                setting.id
            )
            const value = settingValue?.value ?? setting.default

            keyboard.row()
            keyboard.add(
                SettingShowButton.button({
                    ctx,
                    data: {
                        settingId: setting.id,
                        type: setting.valueType,
                        userId,
                        page
                    },
                    key: 'setting/show/button',
                    vars: {
                        setting: {
                            ...setting,
                            ...setting.getVars(ctx),
                            value: setting.getShowableValue(ctx, value)
                        }
                    },
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