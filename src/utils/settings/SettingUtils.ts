import { SettingValueTypes } from "../../protos/settings_pb"
import { chatSettings } from "../../resources/settings/chat"
import { ranksSettings } from "../../resources/settings/ranks"
import { userSettings } from "../../resources/settings/user"
import type { DefaultSetting, SettingTypes } from "../../types/settings"
import type Setting from "./Setting"

type Settings = DefaultSetting[]

export default class SettingUtils {
    private static readonly _settings: Record<SettingValueTypes, Settings> = {
        [SettingValueTypes.User]: userSettings,
        [SettingValueTypes.Chat]: chatSettings,
        [SettingValueTypes.Command]: [],
        [SettingValueTypes.Button]: [],
        [SettingValueTypes.Ranks]: ranksSettings,
    }

    static types = Object.keys(this._settings).map(v => +v) as SettingValueTypes[]

    static add<V extends SettingValueTypes>(type: V, ...settings: Setting<SettingTypes, V>[]): void {
        for (const setting of settings) {
            this._settings[type].push(setting)
        }
    }

    static getAll<V extends SettingValueTypes>(type: SettingValueTypes): Setting<SettingTypes, V>[] {
        return this._settings[type] as Setting<SettingTypes, V>[]
    }

    static get<V extends SettingValueTypes>(type: V, id: number): Setting<SettingTypes, V> {
        return this.getAll(type)
            .find(v => v.id == id) as Setting<SettingTypes, V>
    }
}