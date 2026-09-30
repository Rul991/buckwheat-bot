import LevelService from "../../../../../db/services/level/LevelService"
import UserService from "../../../../../db/services/user/UserService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import ExperienceUtils from "../../../../../utils/level/ExperienceUtils"
import LevelUtils from "../../../../../utils/level/LevelUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class LevelCommand extends BuckwheatCommand {
    override aliases: string[] = ['левел', 'лвл']
    override minimumRank: number = RankUtils.min
    override settingId: number = 33
    override name: string = 'уровень'
    override isSupportReply: boolean = true
    override filename: string = 'level'

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            chatId,
            id,
            ctx,
            replyOrUserFrom
        } = options

        const isSelf = replyOrUserFrom.id == id
        const replyId = replyOrUserFrom.id

        const level = isSelf ? await ctx.vars.level.get() : await LevelService.get(chatId, replyId)
        const currentLevel = LevelUtils.get(level?.currentExperience ?? ExperienceUtils.min)

        const reply = isSelf ?
            await ctx.vars.user.get() :
            await UserService.get(chatId, replyId)

        return {
            key: 'level/show',
            options: {
                vars: {
                    level: currentLevel,
                    reply
                }
            }
        }
    }
}