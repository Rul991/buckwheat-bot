import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import ExperienceUtils from "../../../../../utils/level/ExperienceUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class ExperienceCommand extends BuckwheatCommand {
    override aliases: string[] = []
    override minimumRank: number = RankUtils.min
    override settingId: number = 34
    override name: string = 'сколько'
    override needData: boolean = true
    override filename: string = 'experience'

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            other
        } = options

        const level = ctx.vars.level
        const experience = level?.currentExperience ?? ExperienceUtils.min
        const remainingExperience = ExperienceUtils.clamp(ExperienceUtils.getRemainingExperienceToLevelUp(experience))

        return {
            key: 'level/remaining',
            options: {
                vars: {
                    remainingExperience,
                    other
                }
            }
        }
    }
}