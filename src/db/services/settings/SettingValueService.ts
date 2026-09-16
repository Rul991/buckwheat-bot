import type { SettingValueTypes } from "../../../protos/settings_pb"
import type { SettingTypes, SettingValueOptions } from "../../../types/settings"
import type Setting from "../../../utils/settings/Setting"
import SettingValue from "../../entities/settings/SettingValue"
import BaseService from "../base/BaseService"

class SettingValueService extends BaseService<typeof SettingValue> {
    constructor() {
        super(SettingValue)
    }

    async get<T extends SettingTypes, V extends SettingValueTypes>(options: SettingValueOptions<T, V>): Promise<SettingValue<T, V>> {
        const {
            setting,
            id,
        } = options
        const settingId = setting.id
        const valueType = setting.valueType

        return await this._repo.getOrCreate(
            {
                settingId,
                id,
                valueType,
            },
            new SettingValue(options)
        ) as SettingValue<T, V>
    }

    async getArray<V extends SettingValueTypes>(id: number, valueType: V): Promise<SettingValue<SettingTypes, V>[]> {
        return await this._repo.find({
            id,
            valueType,
        }) as SettingValue<SettingTypes, V>[]
    }

    async getBySettings<T extends SettingTypes, V extends SettingValueTypes>(id: number, settings: Setting<T, V>[]): Promise<Map<number, SettingValue<T, V>>> {
        const result = new Map<number, SettingValue<T, V>>()
        const settingValues = (await this._repo.model.find({
            id,
            settingId: {
                $in: settings.map(v => v.id)
            },
        }).lean().exec()) as unknown as SettingValue<T, V>[]

        for (const value of settingValues) {
            result.set(
                value.settingId,
                value
            )
        }

        return result
    }
}

export default new SettingValueService()