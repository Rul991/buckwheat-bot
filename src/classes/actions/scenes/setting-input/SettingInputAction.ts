import { AsyncOrSync } from '../../../../utils/values/types/types'
import SceneAction from '../SceneAction'
import MessageUtils from '../../../../utils/MessageUtils'
import StringUtils from '../../../../utils/StringUtils'
import SettingUtils from '../../../../utils/settings/SettingUtils'
import Setting from '../../../../interfaces/other/Setting'
import MathUtils from '../../../../utils/MathUtils'
import { FIRST_INDEX, INFINITY_SYMB } from '../../../../utils/values/consts'
import { SceneOptions } from '../../../../utils/values/types/action-options'
import SettingsService from '../../../db/services/settings/SettingsService'

type Data = {
    settingId: string
    settingsId: number
    type: string
    setting?: Setting<'number' | 'string'>
    isNumber: boolean
}

export default class extends SceneAction<Data> {
    constructor () {
        super()
        this._name = 'setting-input'
    }

    private _getNumberValue(text: string, min: number, max: number) {
        const rawNumber = StringUtils.getNumberFromString(text)
        const value = MathUtils.clamp(
            rawNumber,
            min,
            max
        )

        return value
    }

    private _getStringValue(text: string, min: number, max: number) {
        if(text.length < min) {
            return text.padEnd(min)
        }
        else if(text.length > max) {
            return text.substring(FIRST_INDEX, max)
        }

        return text
    }

    protected _execute({ scene }: SceneOptions<Data>): AsyncOrSync {
        const getSetting = async (key: string, type: string) => {
            return await SettingUtils.getSetting<'number' | 'string'>(
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
                'text/scenes/setting-number/enter.pug',
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
                type
            } = ctx.scene.state

            const setting = rawSetting!

            const {
                properties = {},
                title,
                type: settingType
            } = setting

            const {
                min = Number.MIN_SAFE_INTEGER,
                max = Number.MAX_SAFE_INTEGER
            } = properties

            const value = type == 'string' ?
                this._getStringValue(text, min, max) :
                this._getNumberValue(text, min, max)

            await SettingsService.setSetting(
                settingsId,
                type,
                settingId,
                value
            )

            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/scenes/setting-number/saved.pug',
                {
                    changeValues: {
                        title,
                        value: settingType == 'number' ?
                            StringUtils.toFormattedNumber(value as number) :
                            value
                    }
                }
            )
            await ctx.scene.leave()
        })
    }
}