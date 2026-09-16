import type { SettingValueTypes } from "../../protos/settings_pb"
import type { SettingTypes, SettingTypeToProperties, SettingTypeToDefault } from "../../types/settings"

export default class Setting<K extends SettingTypes, V extends SettingValueTypes> {
    id: number
    type: K
    valueType: V
    textKey: string
    vars?: Record<string, any>

    default: SettingTypeToDefault[K]
    properties: SettingTypeToProperties[K]

    constructor({
        type,
        default: defaultValue,
        id,
        textKey,
        properties,
        valueType,
        vars
    }: Omit<Setting<K, V>, 'titleKey' | 'descriptionKey'>) {
        this.id = id
        this.type = type
        this.textKey = textKey
        this.valueType = valueType
        
        this.default = defaultValue
        this.properties = properties
        this.vars = vars ?? {}
    }

    get titleKey(): string {
        return `settings/title/${this.textKey}`
    }

    get descriptionKey(): string {
        return `settings/description/${this.textKey}`
    }
}