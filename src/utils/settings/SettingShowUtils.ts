import ChatSettingsService from '../../classes/db/services/settings/ChatSettingsService'
import LegacyInlineKeyboardManager from '../../classes/main/LegacyInlineKeyboardManager'
import FileUtils from '../FileUtils'
import MessageUtils from '../MessageUtils'
import { DEFAULT_SETTINGS_TYPE, SET_DATE_PHRASE, SET_NUMBER_PHRASE, SET_STRING_PHRASE } from '../values/consts'
import { SettingType, CallbackButtonValue, SettingPropertiesValues, SettingTypeDefault } from '../values/types/types'
import { CallbackButtonContext } from '../values/types/contexts'
import SettingUtils from './SettingUtils'
import StringUtils from '../StringUtils'
import SettingsService from '../../classes/db/services/settings/SettingsService'
import TimeUtils from '../TimeUtils'
import JsonUtils from '../JsonUtils'

type ValuesOptions<K extends SettingType> = {
    type: K,
    properties?: SettingPropertiesValues[K],
    settingId: string
    id: number
    page: number
    filename: string
}

type EditMessageOptions = {
    filename?: string
    settingId: string
    id: number
    ctx: CallbackButtonContext
    page?: number
    settingsId: number
}

export default class {
    private static _getButtons<K extends SettingType>({
        settingId,
        id,
        type,
        properties,
        page,
        filename
    }: ValuesOptions<K>): CallbackButtonValue[] {
        const constantValue = {
            id,
            n: settingId,
            p: page,
            t: filename
        }

        if (type == 'boolean') {
            return [
                {
                    data: JsonUtils.stringify({ ...constantValue, v: false }),
                    text: StringUtils.getShowValue(false)
                },
                {
                    data: JsonUtils.stringify({ ...constantValue, v: true }),
                    text: StringUtils.getShowValue(true)
                }
            ]
        }
        else if (type == 'enum') {
            const enumKey = 'values'
            if (properties && enumKey in properties) {
                return properties[enumKey].map(v => ({
                    text: StringUtils.getShowValue(v),
                    data: JsonUtils.stringify({ ...constantValue, v })
                }))
            }
        }
        else if (type == 'number') {
            return [
                {
                    data: JsonUtils.stringify({ ...constantValue, v: SET_NUMBER_PHRASE }),
                    text: '🔢 Ввести число'
                }
            ]
        }
        else if (type == 'string') {
            return [
                {
                    data: JsonUtils.stringify({ ...constantValue, v: SET_STRING_PHRASE }),
                    text: '✍️ Ввести текст'
                }
            ]
        }
        else if (type == 'date') {
            return [
                {
                    data: JsonUtils.stringify({ ...constantValue, v: SET_DATE_PHRASE }),
                    text: '📅 Ввести дату'
                }
            ]
        }

        return []
    }

    static getShowValue<K extends SettingType>(type: K, value: SettingTypeDefault[K]) {
        if(type == 'date') {
            return TimeUtils.formatMillisecondsToTime(value, false)
        }
        else if(type == 'number') {
            return StringUtils.toFormattedNumber(value)
        }
        else {
            return StringUtils.getShowValue(value)
        }
    }

    static getShowProperties<K extends SettingType>(
        type: K,
        properties: SettingPropertiesValues[K]
    ) {
        const result: Record<string, any> = {}
        
        for (const key in properties) {
            result[key] = this.getShowValue(
                type,
                //@ts-ignore
                properties[key]
            )
        }

        return result
    }

    static async editMessage({
        filename = DEFAULT_SETTINGS_TYPE,
        settingId,
        id,
        ctx,
        page = -1,
        settingsId,
    }: EditMessageOptions): Promise<string | void> {
        const setting = await SettingUtils.getSetting(
            filename,
            settingId
        )
        if (!setting) return await FileUtils.readPugFromResource('text/commands/settings/no-setting.pug')

        const values = this._getButtons<any>({
            settingId,
            id,
            type: setting.type,
            properties: setting.properties,
            page,
            filename
        })

        const rawProperties: Record<string, any> = Object.assign({}, setting.properties)
        const properties = this.getShowProperties(
            setting.type,
            rawProperties
        )

        await MessageUtils.editText(
            ctx,
            await FileUtils.readPugFromResource(
                'text/commands/settings/show.pug',
                {
                    changeValues: {
                        ...setting,
                        defaultValue: this.getShowValue(
                            setting.type,
                            await SettingsService.getSetting(
                                settingsId,
                                filename,
                                settingId
                            )
                        ),
                        properties
                    }
                }
            ),
            {
                reply_markup: {
                    inline_keyboard: await LegacyInlineKeyboardManager.map(
                        'settings/show',
                        {
                            values: {
                                values
                            },
                            globals: {
                                id,
                                page,
                                type: JsonUtils.stringify(filename)
                            },
                            maxWidth: 4
                        }
                    )
                }
            }
        )
    }
}