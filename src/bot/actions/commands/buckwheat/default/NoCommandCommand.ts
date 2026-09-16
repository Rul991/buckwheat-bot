import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class NoCommandCommand extends BuckwheatCommand {
    override aliases: string[] = []
    override minimumRank: number = RankUtils.min
    override name: string = this.constructor.name
    override settingId: number = 8
    override filename: string = ''

    override async execute(_: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        return {
            key: 'commands/system/non-command'
        }
    }

}