import RoleplayService from "../../../../../db/services/rp/RoleplayService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import { startRoleplayKeyboard } from "../../../../keyboards/rp"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class RoleplayCommand extends BuckwheatCommand {
    override aliases: string[] = ['ролеплей']
    override minimumRank: number = RankUtils.min
    override settingId: number = 56
    override name: string = 'рп'
    override filename: string = 'rp'
    
    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            chatId,
            ctx,
            id
        } = options
        const count = await RoleplayService.count(chatId)

        return {
            key: 'rp/start',
            options: {
                vars: {
                    count
                },
                keyboard: await startRoleplayKeyboard(
                    ctx,
                    {
                        id
                    }
                )
            }
        }
    }
}