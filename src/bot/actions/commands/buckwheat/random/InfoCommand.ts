import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class InfoCommand extends BuckwheatCommand {
    override aliases: string[] = ['инфо']
    override minimumRank: number = RankUtils.min
    override settingId: number = 26
    override name: string = 'инфа'
    override filename: string = 'info'
    override needData: boolean = true

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            other
        } = options

        return {
            key: 'random/info',
            options: {
                vars: {
                    other
                }
            }
        }
    }
}