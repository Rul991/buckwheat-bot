import { GetSettingForManyResult, SettingType, SettingTypeDefault, SettingWithId } from '../../../../utils/values/types/types'
import SettingsService from './SettingsService'

export default class {
    protected _filename: string

    constructor(filename: string) {
        this._filename = filename
    }

    async get<K extends SettingType = any>(id: number, settingId: string) {
        return await SettingsService.getSetting<K>(
            id,
            this._filename,
            settingId
        )
    }

    async set<K extends SettingType = any>(
        id: number, 
        settingId: string, 
        value: SettingTypeDefault[K]
    ) {
        return await SettingsService.setSetting<K>(
            id,
            this._filename,
            settingId,
            value
        )
    }

    async getAll(
        id: number
    ): Promise<SettingWithId[]> {
        const settings = await SettingsService.getSettingsArray(
            id, 
            this._filename
        )
        return settings
    }

    async getObject(
        id: number
    ) {
        return await SettingsService.getSettingsObject(
            id,
            this._filename
        )
    }

    async setMany(
        id: number,
        settings: Map<string, any>
    ) {
        return await SettingsService.setSettings(
            id,
            this._filename,
            settings
        )
    }

    async delete(
        id: number
    ) {
        return await SettingsService.delete(id, this._filename)
    }

    async getSettingForMany<K extends SettingType = any>(
        ids: number[],
        settingId: string
    ): Promise<GetSettingForManyResult<K>[]> {
        return await SettingsService.getSettingForMany(
            ids,
            this._filename,
            settingId
        )
    }
}