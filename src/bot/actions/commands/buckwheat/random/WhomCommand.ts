import UserService from "../../../../../db/services/user/UserService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class WhomCommand extends BuckwheatCommand {
    override aliases: string[] = ['кому', 'кем']
    override minimumRank: number = RankUtils.min
    override settingId: number = 39
    override name: string = 'кого'
    override filename: string = 'whom'
    override needData: boolean = true
    
    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            chatId,
            other = '',
            commandStrings: [_, command]
        } = options

        const user = await UserService.getRandom(chatId)

        return {
            key: 'whom/done',
            options: {
                vars: {
                    other,
                    user,
                    command
                }
            }
        }
    }
}