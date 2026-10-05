import { MAX_TAG_LENGTH } from "../../../../../consts/lengths"
import UserService from "../../../../../db/services/user/UserService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import AdminUtils from "../../../../../utils/bot/AdminUtils"
import RankUtils from "../../../../../utils/db/RankUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class SetTagCommand extends BuckwheatCommand {
    override aliases: string[] = ['тег', 'тэг']
    override filename: string = 'tag'
    override minimumRank: number = RankUtils.max
    override settingId: number = 118
    override name: string = 'приписка'
    override needData: boolean = true

    
    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            chatId,
            replyFrom,
            other = ''
        } = options

        if(!replyFrom) {
            return {
                key: 'tag/no-reply'
            }
        }

        const replyId = replyFrom.id
        const reply = ctx.vars.id == replyId ?
            await ctx.vars.user.get() : 
            await UserService.get(chatId, replyId)

        const tag = other.slice(0, MAX_TAG_LENGTH).trim()
        const isChanged = await AdminUtils.setAdminTag(
            ctx,
            replyId,
            tag
        )

        if(isChanged) {
            await UserService.updateOne(
                chatId,
                replyId,
                {
                    tag: tag
                }
            )
        }

        return {
            key: 'tag/set',
            options: {
                vars: {
                    isChanged,
                    reply,
                    tag
                }
            }
        }
    }
}