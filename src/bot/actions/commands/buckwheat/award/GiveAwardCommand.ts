import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"
import GiveAwardConversation from "../../../conversations/award/GiveAwardConversation"

export default class GiveAwardCommand extends BuckwheatCommand {
    override aliases: string[] = ['награди', 'вознаградить']
    override filename: string = 'award/give'
    override minimumRank: number = RankUtils.admin
    override settingId: number = 126
    override name: string = 'наградить'
    override isSupportReply: boolean = true
    
    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            isSelf,
            id,
            replyOrUserFrom,
            ctx,
        } = options

        if(isSelf) {
            return {
                key: 'award/message/self-award'
            }
        }
        const replyId = replyOrUserFrom.id

        await GiveAwardConversation.enter(
            ctx,
            {
                giverId: id,
                ownerId: replyId
            }
        )
    }
}