import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class SearchCommand extends BuckwheatCommand {
    override aliases: string[] = []
    override filename: string = 'search'
    override minimumRank: number = RankUtils.min
    override settingId: number = 92
    override name: string = 'поиск'
    override needData: boolean = true
    
    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {

        } = options
    }
}