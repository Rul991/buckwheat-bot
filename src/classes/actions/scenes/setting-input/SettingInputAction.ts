import { AsyncOrSync, SettingInputType, SettingTypeDefault } from '../../../../utils/values/types/types'
import SceneAction from '../SceneAction'
import MessageUtils from '../../../../utils/MessageUtils'
import SettingUtils from '../../../../utils/settings/SettingUtils'
import { INFINITY_SYMB } from '../../../../utils/values/consts'
import { SceneOptions } from '../../../../utils/values/types/action-options'
import SettingsService from '../../../db/services/settings/SettingsService'
import { SettingInputData } from '../../../../utils/values/types/scene-datas'
import SettingShowUtils from '../../../../utils/settings/SettingShowUtils'

export default abstract class <K extends SettingInputType> extends SceneAction<SettingInputData<K>> {
    protected abstract _settingType: K
    protected abstract _getValue(text: string, min: number, max: number): SettingTypeDefault[K]

    constructor () {
        super()
    }

    get name() {
        const result = `setting-${this._settingType}`
        return result
    }

    protected _getShowValue(value: SettingTypeDefault[K]): string {
        return SettingShowUtils.getShowValue(
            this._settingType,
            value
        )
    }

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

            const setting = await getSetting(settingId, type)
            state.setting = setting

            await MessageUtils.answerMessageFromResource(
                ctx,
                `text/scenes/setting-${this._settingType}/enter.pug`,
                {
                    isReply: false,
                    changeValues: {
                        infinitySymbol: INFINITY_SYMB,
                        ...SettingShowUtils.getShowProperties(
                            setting.type,
                            setting.properties
                        )
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

            const result = this._getValue(text, min, max)
            const showValue = this._getShowValue(result)

            await SettingsService.setSetting(
                settingsId,
                type,
                settingId,
                result
            )

            await MessageUtils.answerMessageFromResource(
                ctx,
                `text/scenes/setting-${this._settingType}/saved.pug`,
                {
                    changeValues: {
                        title,
                        value: showValue
                    }
                }
            )
            await ctx.scene.leave()
        })
    }
}