import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import SkillPresenter from "../../../../../utils/duel/skill/SkillPresenter"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class SkillCommand extends BuckwheatCommand {
    override aliases: string[] = ['навык', 'скиллы']
    override filename: string = 'skills'
    override minimumRank: number = RankUtils.min
    override settingId: number = 182
    override name: string = 'навыки'
    
    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx
        } = options

        return await SkillPresenter.menu(ctx)
    }
}