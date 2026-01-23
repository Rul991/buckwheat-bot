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

    static getDummySetting(): Setting<'enum'> {
        const text = 'Неизвестная настройка'
        return {
            type: 'enum',
            title: text,
            description: text,
            properties: {
                values: []
            },
            default: this.dummyDefault
        }
    }

    static get dummyDefault(): string {
        return '?'
    }

    static async getSettings(filename: string): Promise<Settings> {
        const cacheSetting = this._cacheSettings[filename]
        if(cacheSetting) return structuredClone(cacheSetting)

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
        return structuredClone(result)
    }

    static async getSetting<K extends SettingType = "any">(filename: string, settingId: string): Promise<Setting<K>> {
        const settings = await this.getSettings(filename)
        const setting = settings[settingId]

        if (!setting) {
            Logging.warn(`no setting "${settingId}"`)
            return this.getDummySetting() as Setting<K>
        }

        return setting
    }

    static setSettings(filename: string, settings: Settings) {
        this._cacheSettings[filename] = settings
    }

    static addSettings(filename: string, settings: Settings) {
        const currentSettings = this._cacheSettings[filename] ?? {}
        this._cacheSettings[filename] = {
            ...currentSettings,
            ...settings
        }
    }

    static isForUser(type: string) {
        return USER_SETTINGS_TYPES.some(v => v == type)
    }

    static getSettingsId(chatId: number, id: number, type: string) {
        const isSettingForUser = this.isForUser(type)
        return isSettingForUser ? id : chatId
    }
}