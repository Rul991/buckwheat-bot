import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import ClassUtils from "../../../../../utils/db/ClassUtils"
import RankUtils from "../../../../../utils/db/RankUtils"
import { startRecipeKeyboard } from "../../../../keyboards/recipe"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class CraftCommand extends BuckwheatCommand {
    override aliases: string[] = ['скрафтить', 'крафты', 'рецепт', 'рецепты', 'изготовить', 'инженер']
    override filename: string = 'craft'
    override minimumRank: number = RankUtils.min
    override settingId: number = 120
    override name: string = 'крафт'

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            id
        } = options

        const user = await ctx.vars.user.require()
        const canCraft = ClassUtils.canCraft(user.className)

        if (!canCraft) {
            return {
                key: 'craft/message/not-engineer'
            }
        }

        return {
            key: 'craft/message/start',
            options: {
                keyboard: await startRecipeKeyboard(ctx, { id })
            }
        }
    }
}