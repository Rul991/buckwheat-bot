import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import { startChatsKeyboard } from "../../../../keyboards/chat"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class ChatsCommand extends BuckwheatCommand {
    override aliases: string[] = []
    override filename: string = 'chats'
    override minimumRank: number = RankUtils.min
    override settingId: number = 134
    override name: string = 'чаты'
    
    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            id,
            ctx
        } = options

        return {
            key: 'chat/public/start',
            options: {
                keyboard: await startChatsKeyboard(
                    ctx,
                    {
                        id
                    }
                )
            }
        }
    }
}