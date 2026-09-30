import type SettingValue from "../db/entities/settings/SettingValue"
import type { SettingValueTypes } from "../protos/settings_pb"
import type Setting from "../utils/settings/Setting"

export type SettingTypeToDefault = {
    date: number
    string: string
    number: number
    enum: string
    boolean: boolean
}
export type SettingTypeToProperties = {
    date: {
        min: number
        max: number
    }
    string: SettingTypeToProperties['date']
    number: SettingTypeToProperties['date']
    enum: {
        values: readonly string[]
    }
    boolean: {}
}

export type SettingTypes = keyof SettingTypeToDefault

export type SettingValueOptions<T extends SettingTypes, V extends SettingValueTypes> = {
    setting: Setting<T, V>,
    id: number,
    value?: SettingValue<T>['value']
}
export type SettingSetValueOptions<T extends SettingTypes, V extends SettingValueTypes> = Required<
    SettingValueOptions<T, V>
>

export type DefaultSetting = Setting<SettingTypes, SettingValueTypes>