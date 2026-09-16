import ChatService from "../../../../../db/services/chat/ChatService"
import BalanceService from "../../../../../db/services/money/BalanceService"
import UserService from "../../../../../db/services/user/UserService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class StatsCommand extends BuckwheatCommand {
    override aliases: string[] = ['стата', 'статы']
    override filename: string = 'stats'
    override minimumRank: number = RankUtils.min
    override settingId: number = 88
    override name: string = 'статистика'
    
    override async execute({}: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const chats = await ChatService.count()
        const users = await UserService.count()

        const uniqueUsers = await UserService.getUniqueUsersCount()
        const money = await BalanceService.getEnvellBalance()

        return {
            key: 'stats/info',
            options: {
                vars: {
                    chats,
                    users,
                    uniqueUsers,
                    money
                }
            }
        }
    }
}