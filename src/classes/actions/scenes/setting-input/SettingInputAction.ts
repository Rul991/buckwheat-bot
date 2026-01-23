import { AsyncOrSync, SettingType, SettingTypeDefault } from '../../../../utils/values/types/types'
import SceneAction from '../SceneAction'
import MessageUtils from '../../../../utils/MessageUtils'
import StringUtils from '../../../../utils/StringUtils'
import SettingUtils from '../../../../utils/settings/SettingUtils'
import Setting from '../../../../interfaces/other/Setting'
import MathUtils from '../../../../utils/MathUtils'
import { FIRST_INDEX, INFINITY_SYMB } from '../../../../utils/values/consts'
import { SceneOptions } from '../../../../utils/values/types/action-options'
import SettingsService from '../../../db/services/settings/SettingsService'
import { SettingInputData } from '../../../../utils/values/types/scene-datas'

export default abstract class<K extends 'string' | 'number'> extends SceneAction<SettingInputData<K>> {
    protected abstract _settingType: K
    protected abstract _getValue(text: string, min: number, max: number): SettingTypeDefault[K]

    protected _execute({ scene }: SceneOptions<SettingInputData<K>>): AsyncOrSync {
        const getSetting = async (key: string, type: string) => {
            return await SettingUtils.getSetting<K>(
                type,
                key
            )
        }

        scene.enter(async ctx => {
            const {
                state
            } = ctx.scene
            const {
                settingId,
                type
            } = state

            await MessageUtils.deleteMessage(ctx)

            const setting = await getSetting(settingId, type)
            state.setting = setting

            await MessageUtils.answerMessageFromResource(
                ctx,
                `text/scenes/setting-${this._settingType}/enter.pug`,
                {
                    isReply: false,
                    changeValues: {
                        infinitySymbol: INFINITY_SYMB,
                        ...setting.properties
                    }
                }
            )
        })

        scene.on('text', async ctx => {
            const text = ctx.message.text

            const {
                setting: rawSetting,
                settingsId,
                settingId = '',
                type,
            } = ctx.scene.state

            const setting = rawSetting!

            const {
                title,
            } = setting

            const {
                min = Number.MIN_SAFE_INTEGER,
                max = Number.MAX_SAFE_INTEGER
            } = setting.properties ?? {}

            const value = this._getValue(text, min, max)

            await SettingsService.setSetting(
                settingsId,
                type,
                settingId,
                value
            )

            await MessageUtils.answerMessageFromResource(
                ctx,
                `text/scenes/setting-${this._settingType}/saved.pug`,
                {
                    changeValues: {
                        title,
                        value
                    }
                }
            )
            await ctx.scene.leave()
        })
    }
}