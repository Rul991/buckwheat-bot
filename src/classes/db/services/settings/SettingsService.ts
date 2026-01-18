import SettingUtils from '../../../../utils/settings/SettingUtils'
import { GetSettingForManyResult, SettingType, SettingTypeDefault, SettingWithId } from '../../../../utils/values/types/types'
import SettingsRepository from '../../repositories/SettingsRepository'

export default class {
    static async get(chatId: number, filename: string) {
        const settings = await SettingsRepository.findOne(
            chatId,
            {
                type: filename
            }
        )

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

    static async getSettingsObject(chatId: number, filename: string): Promise<Record<string, any>> {
        const settings = await this.get(chatId, filename)
        return settings.settings ?? {}
    }

    static async getSetting<K extends SettingType = any>(
        chatId: number,
        filename: string,
        settingId: string
    ): Promise<SettingTypeDefault[K]> {
        const {
            settings
        } = await this.get(chatId, filename)
        const value = settings.get(settingId)

        if (value !== undefined && value !== null) {
            return value
        }
        else {
            const setting = await SettingUtils.getSetting<K>(filename, settingId)
            return setting.default
        }
    }

    static async getSettingForMany<K extends SettingType = any>(
        ids: number[],
        filename: string,
        settingId: string
    ): Promise<GetSettingForManyResult<K>[]> {
        const setting = await SettingUtils.getSetting<K>(filename, settingId)
        const defaultValue = setting.default

        const settings = await SettingsRepository.findMany({
            id: {
                $in: ids
            },
            type: filename
        })

        return settings.map(({ id, settings }) => {
            return {
                id,
                value: settings.get(settingId) ?? defaultValue
            }
        })
    }

    static async setSettings(
        chatId: number,
        filename: string,
        newSettings: Map<string, any>
    ) {
        const {
            settings
        } = await this.get(chatId, filename)

        newSettings.forEach((value, key) => {
            settings.set(key, value)
        })

        return await SettingsRepository.updateOneByFilter(
            { id: chatId, type: filename },
            {
                settings
            }
        )
    }

    static async setSetting<K extends SettingType = any>(
        chatId: number,
        filename: string,
        settingId: string,
        value: SettingTypeDefault[K]
    ) {
        const map: Map<string, any> = new Map()
        map.set(settingId, value)

        return await this.setSettings(
            chatId,
            filename,
            map
        )
    }
}