import RuleService from "../../../../../db/services/chat/RuleService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import { startRuleKeyboard } from "../../../../keyboards/rule"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class RuleCommand extends BuckwheatCommand {
    override aliases: string[] = ['правило']
    override minimumRank: number = RankUtils.min
    override settingId: number = 63
    override name: string = 'правила'
    override filename: string = 'rule'
    
    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            chatId,
            id
        } = options
        const count = await RuleService.count(chatId)

        return {
            key: 'rule/start',
            options: {
                vars: {
                    count
                },
                keyboard: await startRuleKeyboard(
                    ctx,
                    {
                        id
                    }
                )
            }
        }
    }
}