import { index, prop, Severity } from "@typegoose/typegoose"
import IdEntity from "../base/IdEntity"
import type { SettingTypes, SettingTypeToDefault, SettingValueOptions } from "../../../types/settings"
import type { SettingValueTypes } from "../../../protos/settings_pb"
import { Schema } from "mongoose"

@index(
    {
        id: 1,
        settingId: 1,
        valueType: 1
    },
    {
        unique: true
    }
)
export default class SettingValue<T extends SettingTypes = SettingTypes, V extends SettingValueTypes = SettingValueTypes> extends IdEntity {
    @prop()
    settingId: number

    @prop({ type: Schema.Types.Mixed, allowMixed: Severity.ALLOW })
    value: SettingTypeToDefault[T]

    @prop({ type: Number })
    valueType: SettingValueTypes

    constructor({
        setting,
        id,
        value,
    }: SettingValueOptions<T, V>) {
        super(id)
        this.settingId = setting.id
        this.value = value ?? setting.default
        this.valueType = setting.valueType
    }
}