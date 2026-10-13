import AwardService from "../../../../../db/services/award/AwardService"
import UserService from "../../../../../db/services/user/UserService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import { startAwardKeyboard } from "../../../../keyboards/award"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class AwardsCommand extends BuckwheatCommand {
    override aliases: string[] = ['награды']
    override filename: string = 'award/list'
    override minimumRank: number = RankUtils.min
    override settingId: number = 127
    override name: string = 'награды'
    
    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            chatId,
            id,
            replyOrUserFrom,
            isSelf
        } = options

        const ownerId = replyOrUserFrom.id
        const count = await AwardService.count(chatId, ownerId)
        
        const owner = isSelf ?
            await ctx.vars.user.get() :
            await UserService.get(chatId, ownerId)

        return {
            key: 'award/message/start',
            options: {
                keyboard: await startAwardKeyboard(
                    ctx,
                    {
                        ownerId,
                        userId: id
                    }
                ),
                vars: {
                    count,
                    owner
                }
            }
        }
    }
}