import { SettingPropertiesValues, SettingType, SettingTypeDefault } from '../../utils/values/types/types'

export default interface Setting<K extends SettingType = 'any'> {
    title: string
    description: string
    type: K
    default: SettingTypeDefault[K]
    properties: SettingPropertiesValues[K]
}