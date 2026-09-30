import MarriageService from "../../../../../db/services/marriage/MarriageService"
import UserService from "../../../../../db/services/user/UserService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import { startMarriageKeyboard } from "../../../../keyboards/marriage"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class MarryCommand extends BuckwheatCommand {
    override aliases: string[] = ['свадьба', 'встречаться', 'жениться']
    override filename: string = 'marry'
    override minimumRank: number = RankUtils.min
    override settingId: number = 103
    override name: string = 'пожениться'
    override isSupportReply: boolean = true

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            chatId,
            id,
            replyOrUserFrom
        } = options

        const replyId = replyOrUserFrom.id
        const isSelf = replyId == id

        const user = await ctx.vars.user.get()
        const marriage = await MarriageService.get(
            chatId,
            id,
        )
        const canMarry = !marriage

        if (!canMarry) {
            return {
                key: 'marriage/marry/cant-marry',
                options: {
                    vars: {
                        user
                    }
                }
            }
        }

        const reply = isSelf ? user : await UserService.get(chatId, replyId)
        return {
            key: 'marriage/marry/suggest',
            options: {
                vars: {
                    suggester: user,
                    target: reply
                },
                keyboard: await startMarriageKeyboard(
                    ctx,
                    {
                        suggester: id,
                        target: replyId
                    }
                )
            }
        }
    }
}