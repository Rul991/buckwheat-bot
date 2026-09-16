import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class FaqCommand extends BuckwheatCommand {
    override aliases: string[] = ['чаво', 'помоги', 'помощь']
    override minimumRank: number = RankUtils.min
    override name: string = 'как'
    override needData: boolean = true
    override filename: string = 'faq'
    override settingId: number = 11

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {

        } = options
    }
}