import type { CommandType } from "../../../protos/commands_pb"
import type { SettingValueTypes } from "../../../protos/settings_pb"
import type { CommandDescription } from "../../../types/command"
import type Setting from "../../../utils/settings/Setting"
import RankedAction from "./RankedAction"

export default abstract class ShowableAction<T extends CommandType> extends RankedAction {
    abstract aliases: string[]
    abstract type: T
    abstract filename: string

    needData: boolean = false
    isSupportReply: boolean = false
    isShow: boolean = true

    override get rankSettings(): Setting<"enum", SettingValueTypes>[] {
        return this.isShow ? super.rankSettings : []
    }

    get commandDescription(): CommandDescription {
        const key = this.filename

        return {
            name: this.name,
            argumentText: `commands/argument/${key}`,
            description: `commands/description/${key}`,
            aliases: this.aliases,
            isSupportReply: this.isSupportReply,
            needData: this.needData,
            type: this.type,
            isShow: this.isShow,
            settingId: this.settingId
        }
    }
}