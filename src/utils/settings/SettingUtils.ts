import { join } from 'path'
import Setting from '../../interfaces/other/Setting'
import FileUtils from '../FileUtils'
import ObjectValidator from '../ObjectValidator'
import { settingSchema } from '../values/schemas'
import { SettingType } from '../values/types/types'

type Settings = Record<string, Setting<any>>

export default class {
    private static _directory = 'json/settings/'

    static async getSettings(filename: string): Promise<Settings> {
        const result = {} as Settings
        const json = await FileUtils.readJsonFromResource<Settings>(join(
            this._directory,
            `${filename}.json`
        ))

        for (const key in json) {
            const obj = json[key]
            
            if(ObjectValidator.isValidatedObject(obj, settingSchema)) {
                result[key] = obj
            }
        }

        return result
    }

    static async getSetting<K extends SettingType = "any">(filename: string, settingId: string): Promise<Setting<K> | null> {
        const settings = await this.getSettings(filename)
        return settings[settingId] ?? null
    }
}