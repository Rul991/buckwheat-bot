import type { SettingValueTypes } from "../../protos/settings_pb"
import type { SettingTypes, SettingTypeToProperties, SettingTypeToDefault } from "../../types/settings"
import type { BotContext } from "../../types/bot"
import TimeUtils from "../time/TimeUtils"

type ConstructorOptions<K extends SettingTypes, V extends SettingValueTypes> =
    & Omit<Setting<K, V>, 'titleKey' | 'descriptionKey' | 'clone' | 'schema' | 'getVars' | 'getShowableValue'>
    & {
        descriptionKey?: string
    }

export default class Setting<K extends SettingTypes, V extends SettingValueTypes> {
    private _descriptionKey?: string

    id: number
    type: K
    valueType: V
    vars?: Record<string, any>

    default: SettingTypeToDefault[K]
    properties: SettingTypeToProperties[K]
    textKey: string

    constructor({
        type,
        default: defaultValue,
        id,
        textKey,
        properties,
        valueType,
        vars
    }: ConstructorOptions<K, V>) {
        this.id = id
        this.type = type
        this.textKey = textKey
        this.valueType = valueType

        this.default = defaultValue
        this.properties = properties
        this.vars = vars ?? {}
    }

    get titleKey(): string {
        return `settings/${this.textKey}/title`
    }

    set descriptionKey(value: string | undefined) {
        this._descriptionKey = value
    }

    get descriptionKey(): string {
        return `settings/${this._descriptionKey ?? this.textKey}/description`
    }

    clone(): Setting<K, V> {
        return new Setting({
            type: this.type,
            default: this.default,
            id: this.id,
            descriptionKey: this._descriptionKey,
            properties: this.properties,
            textKey: this.textKey,
            valueType: this.valueType,
            vars: this.vars
        })
    }

    getShowableValue(ctx: BotContext, value: SettingTypeToDefault[K]): string | SettingTypeToDefault[K] {
        if(this.type == 'date') {
            return TimeUtils.formatMillisecondsToTime(
                ctx,
                +value,
                {
                    showHHMMSS: false
                }
            )
        }

        return value
    }

    getVars(ctx: BotContext) {
        return {
            title: ctx.t(this.titleKey, { setting: this }),
            description: ctx.t(this.descriptionKey, { setting: this })
        }
    }
}