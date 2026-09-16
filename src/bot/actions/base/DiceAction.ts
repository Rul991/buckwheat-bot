import { CommandType } from "../../../protos/commands_pb"
import type { SettingValueTypes } from "../../../protos/settings_pb"
import type { DiceActionOptions } from "../../../types/action-options"
import type { Dices } from "../../../types/types"
import RankUtils from "../../../utils/db/RankUtils"
import type Setting from "../../../utils/settings/Setting"
import ShowableAction from "./ShowableAction"

export default abstract class DiceAction extends ShowableAction<CommandType.Dice> {
    type: CommandType.Dice = CommandType.Dice
    protected override _rankCanBeChange: boolean = false
    override aliases: string[] = []
    override minimumRank: number = RankUtils.min
    abstract override name: Dices

    override get rankSettings(): Setting<"enum", SettingValueTypes>[] {
        return super.rankSettings.map(v => {
            if(v.vars) {
                v.vars.noBotName = true
            }
            return v
        })
    }

    abstract override execute(options: DiceActionOptions): Promise<void>
}