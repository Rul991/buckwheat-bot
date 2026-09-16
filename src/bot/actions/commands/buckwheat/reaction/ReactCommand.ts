import { REACT_EMOJIES } from "../../../../../consts/texts"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import type { Reactions } from "../../../../../types/types"
import ContextUtils from "../../../../../utils/bot/ContextUtils"
import RankUtils from "../../../../../utils/db/RankUtils"
import RandomUtils from "../../../../../utils/math/RandomUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class ReactCommand extends BuckwheatCommand {
    override aliases: string[] = ['реакт']
    override filename: string = 'react'
    override minimumRank: number = RankUtils.min + 1
    override settingId: number = 72
    override name: string = 'реакция'
    override needData: boolean = true
    
    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            other,
            ctx
        } = options

        const replyMessage = ctx.msg.reply_to_message ?? ctx.msg
        const messageId = replyMessage.message_id
        
        const reaction = (other ?? RandomUtils.choose(REACT_EMOJIES)) as Reactions
        const isReacted = await ContextUtils.react(
            ctx,
            reaction,
            messageId
        )

        if(!isReacted) {
            return {
                key: 'react/wrong-reaction'
            }
        }
    }
}