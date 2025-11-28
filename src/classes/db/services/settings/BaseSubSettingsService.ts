import { SettingType, SettingTypeDefault, SettingWithId } from '../../../../utils/values/types/types'
import SettingsService from './SettingsService'

export default class {
    protected _filename: string

    constructor(filename: string) {
        this._filename = filename
    }

    async get<K extends SettingType = any>(chatId: number, settingId: string) {
        return await SettingsService.getSetting<K>(
            chatId,
            this._filename,
            settingId
        )
    }

    async set<K extends SettingType = any>(
        chatId: number, 
        settingId: string, 
        value: SettingTypeDefault[K]
    ) {
        return await SettingsService.setSetting<K>(
            chatId,
            this._filename,
            settingId,
            value
        )
    }

    async getAll(
        chatId: number
    ): Promise<SettingWithId[]> {
        const settings = await SettingsService.getSettingsArray(
            chatId, 
            this._filename
        )
        return settings
    }
}