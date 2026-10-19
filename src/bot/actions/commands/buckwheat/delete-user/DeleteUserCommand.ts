import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import { startDeleteUserKeyboard } from "../../../../keyboards/delete-user"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class DeleteUserCommand extends BuckwheatCommand {
    override aliases: string[] = []
    override filename: string = 'delete-user'
    override minimumRank: number = RankUtils.max
    override settingId: number = 156
    override name: string = 'забыть'
    
    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            id
        } = options

        return {
            key: 'delete-user/message/start',
            options: {
                keyboard: await startDeleteUserKeyboard(
                    ctx,
                    {
                        id
                    }
                )
            }
        }
    }
}