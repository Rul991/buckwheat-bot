import Setting from '../../../../interfaces/other/Setting'
import SettingUtils from '../../../../utils/settings/SettingUtils'
import { SettingType, SettingTypeDefault, SettingWithId } from '../../../../utils/values/types/types'
import SettingsRepository from '../../repositories/SettingsRepository'

export default class {
    static async get(chatId: number, filename: string) {
        const settings = await SettingsRepository.findOne(chatId)

        if (!settings) return await SettingsRepository.create({
            id: chatId,
            type: filename,
            settings: new Map()
        })

        return settings
    }

    static async getSettingsArray(chatId: number, filename: string): Promise<SettingWithId[]> {
        const settings = await SettingUtils.getSettings(filename)

        const {
            settings: newSettings
        } = await this.get(chatId, filename)

        newSettings.forEach((value, key) => {
            const obj = settings[key]
            if (!obj) return

            settings[key].default = value
        })

        return Object.entries(settings)
            .map(([key, value]) => {
                return {
                    ...value,
                    id: key
                }
            })
    }

    static async getSetting<K extends SettingType = any>(
        chatId: number,
        filename: string,
        settingId: string
    ): Promise<SettingTypeDefault[K] | undefined> {
        const {
            settings
        } = await this.get(chatId, filename)
        const value = settings.get(settingId)

        if (value !== undefined && value !== null) {
            return value
        }
        else {
            const setting = await SettingUtils.getSetting<K>(filename, settingId)
            return setting?.default
        }
    }

    static async setSetting<K extends SettingType = any>(
        chatId: number,
        filename: string,
        settingId: string,
        value: SettingTypeDefault[K]
    ) {
        const {
            settings
        } = await this.get(chatId, filename)

        settings.set(settingId, value)

        return await SettingsRepository.updateOne(
            chatId,
            {
                settings
            }
        )
    }
}