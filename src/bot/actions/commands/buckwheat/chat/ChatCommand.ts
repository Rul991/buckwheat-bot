import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import ChatUtils from "../../../../../utils/chat/ChatUtils"
import RankUtils from "../../../../../utils/db/RankUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class ChatCommand extends BuckwheatCommand {
    override aliases: string[] = []
    override minimumRank: number = RankUtils.min
    override settingId: number = 55
    override name: string = 'чат'
    override filename: string = 'chat'

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
        } = options

        const chat = await ctx.vars.chat.require()
        return await ChatUtils.message(ctx, chat)
    }
}