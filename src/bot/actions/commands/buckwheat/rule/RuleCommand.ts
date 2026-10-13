import RuleService from "../../../../../db/services/chat/RuleService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import MathUtils from "../../../../../utils/math/MathUtils"
import StringUtils from "../../../../../utils/string/StringUtils"
import { startRuleKeyboard } from "../../../../keyboards/rule"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class RuleCommand extends BuckwheatCommand {
    override aliases: string[] = ['правило']
    override minimumRank: number = RankUtils.min
    override settingId: number = 63
    override name: string = 'правила'
    override filename: string = 'rule'
    override needData: boolean = true
    
    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            chatId,
            id,
            other = ''
        } = options

        const min = 0
        const count = await RuleService.count(chatId)
        const rawPage = StringUtils.getNumberFromString(other) - 1
        const page = MathUtils.clamp(
            rawPage,
            min,
            count - 1
        )

        return {
            key: 'rule/start',
            options: {
                vars: {
                    count,
                    page
                },
                keyboard: await startRuleKeyboard(
                    ctx,
                    {
                        id,
                        page
                    }
                )
            }
        }
    }
}