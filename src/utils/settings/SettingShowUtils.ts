import ChatSettingsService from '../../classes/db/services/settings/ChatSettingsService'
import InlineKeyboardManager from '../../classes/main/InlineKeyboardManager'
import FileUtils from '../FileUtils'
import MessageUtils from '../MessageUtils'
import { SET_NUMBER_PHRASE, SET_STRING_PHRASE } from '../values/consts'
import { SettingType, CallbackButtonValue, SettingPropertiesValues, CallbackButtonContext } from '../values/types/types'
import SettingUtils from './SettingUtils'
import StringUtils from '../StringUtils'

type ValuesOptions<K extends SettingType> = {
    type: K,
    properties?: SettingPropertiesValues[K],
    settingId: string
    id: number
    page: number
}

type EditMessageOptions = {
    filename?: string
    settingId: string
    id: number
    ctx: CallbackButtonContext
    page?: number
    chatId: number
}

export default class {
    private static _getValues<K extends SettingType>({
        settingId,
        id,
        type,
        properties,
        page
    }: ValuesOptions<K>): CallbackButtonValue[] {
        const constantValue = {
            id,
            n: settingId,
            p: page
        }

        if (type == 'boolean') {
            return [
                {
                    data: JSON.stringify({ ...constantValue, v: false }),
                    text: StringUtils.getShowValue(false)
                },
                {
                    data: JSON.stringify({ ...constantValue, v: true }),
                    text: StringUtils.getShowValue(true)
                }
            ]
        }
        else if (type == 'enum') {
            const enumKey = 'values'
            if (properties && enumKey in properties) {
                return properties[enumKey].map(v => ({
                    text: StringUtils.getShowValue(v),
                    data: JSON.stringify({ ...constantValue, v })
                }))
            }
        }
        else if (type == 'number') {
            return [
                {
                    data: JSON.stringify({ ...constantValue, v: SET_NUMBER_PHRASE }),
                    text: 'Ввести число'
                }
            ]
        }
        else if (type == 'string') {
            return [
                {
                    data: JSON.stringify({ ...constantValue, v: SET_STRING_PHRASE }),
                    text: 'Ввести текст'
                }
            ]
        }

        return []
    }

    static async editMessage({
        filename = 'chat',
        settingId,
        id,
        ctx,
        page = -1,
        chatId
    }: EditMessageOptions): Promise<string | void> {
        const setting = await SettingUtils.getSetting(
            filename,
            settingId
        )
        if (!setting) return await FileUtils.readPugFromResource('text/commands/settings/no-setting.pug')

        const values = this._getValues<any>({
            settingId,
            id,
            type: setting.type,
            properties: setting.properties,
            page
        })

        const properties: Record<string, any> = Object.assign({}, setting.properties)

        for (const key in properties) {
            if(typeof properties[key] == 'number') {
                properties[key] = StringUtils.toFormattedNumber(properties[key])
            }
        }

        await MessageUtils.editText(
            ctx,
            await FileUtils.readPugFromResource(
                'text/commands/settings/show.pug',
                {
                    changeValues: {
                        ...setting,
                        defaultValue: StringUtils.getShowValue(await ChatSettingsService.get(chatId, settingId)),
                        properties
                    }
                }
            ),
            {
                reply_markup: {
                    inline_keyboard: await InlineKeyboardManager.map(
                        'settings/show',
                        {
                            values: {
                                values
                            },
                            globals: {
                                id,
                                page
                            },
                            maxWidth: 4
                        }
                    )
                }
            }
        )
    }
}