import { SettingPropertiesValues, SettingType, SettingTypeDefault } from '../../utils/values/types'

export default interface Setting<K extends SettingType = 'any'> {
    title: string
    type: K
    default: SettingTypeDefault[K]
    properties?: SettingPropertiesValues[K]
}