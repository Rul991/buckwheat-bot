import { join } from 'path'
import Setting from '../../interfaces/other/Setting'
import FileUtils from '../FileUtils'
import ObjectValidator from '../ObjectValidator'
import { settingSchema } from '../values/schemas'
import { SettingType } from '../values/types/types'
import { USER_SETTINGS_TYPES } from '../values/consts'
import Logging from '../Logging'

type Settings = Record<string, Setting<any>>

export default class {
    private static _directory = 'json/settings/'
    private static _cacheSettings: Record<string, Settings> = {}

    private static _getDummySetting(): Setting<'enum'> {
        const text = 'Неизвестная настройка'
        return {
            type: 'enum',
            title: text,
            description: text,
            properties: {
                values: []
            },
            default: '?'
        }
    }

    static async getSettings(filename: string): Promise<Settings> {
        const cacheSetting = this._cacheSettings[filename]
        if(cacheSetting) return {...cacheSetting}
        const result = {} as Settings
        const json = await FileUtils.readJsonFromResource<Settings>(join(
            this._directory,
            `${filename}.json`
        ))

        for (const key in json) {
            const obj = json[key]

            if (ObjectValidator.isValidatedObject(obj, settingSchema)) {
                result[key] = obj
            }
        }
        
        this._cacheSettings[filename] = result
        return {...result}
    }

    static async getSetting<K extends SettingType = "any">(filename: string, settingId: string): Promise<Setting<K>> {
        const settings = await this.getSettings(filename)
        const setting = settings[settingId]

        if (!setting) {
            Logging.warn(`no setting "${settingId}"`)
            return this._getDummySetting() as Setting<K>
        }

        return setting
    }

    static addSettings(filename: string, settings: Settings) {
        this._cacheSettings[filename] = settings
    }

    static isForUser(type: string) {
        return USER_SETTINGS_TYPES.some(v => v == type)
    }

    static getSettingsId(chatId: number, id: number, type: string) {
        const isSettingForUser = this.isForUser(type)
        return isSettingForUser ? id : chatId
    }
}