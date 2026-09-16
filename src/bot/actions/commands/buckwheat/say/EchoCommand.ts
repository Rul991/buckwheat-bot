import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import MessageEntityUtils from "../../../../../utils/bot/MessageEntityUtils"
import MessageUtils from "../../../../../utils/bot/MessageUtils"
import RankUtils from "../../../../../utils/db/RankUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class EchoCommand extends BuckwheatCommand {
    override aliases: string[] = ['скажи']
    override minimumRank: number = RankUtils.min + 2
    override settingId: number = 18
    override name: string = 'эхо'
    override filename: string = 'echo'
    override needData: boolean = true
    
    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            chatId,
            other
        } = options
        const isPrivate = ctx.chat.type == 'private'

        if(!other) {
            return {
                key: 'echo/no-text',
                options: {
                    vars: {
                        user: ctx.vars.user
                    },
                    chatId
                }
            }
        }

        if(!isPrivate) {
            await MessageUtils.deleteMessages(ctx)
        }

        return {
            key: 'echo/done',
            options: {
                chatId,
                vars: {
                    text: MessageEntityUtils.messageToHtml(ctx.msg)
                }
            }
        }
    }
}