import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import { startTopKeyboard } from "../../../../keyboards/top"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class TopCommand extends BuckwheatCommand {
    override aliases: string[] = ['иерархия', 'лидеры']
    override filename: string = 'top'
    override minimumRank: number = RankUtils.min
    override settingId: number = 77
    override name: string = 'топ'

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx
        } = options

        return {
            key: 'top/text/start',
            options: {
                keyboard: await startTopKeyboard(ctx, { })
            }
        }
    }
}