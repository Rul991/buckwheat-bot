import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import MessageEntityUtils from "../../../../../utils/bot/MessageEntityUtils"
import MessageUtils from "../../../../../utils/bot/MessageUtils"
import RankUtils from "../../../../../utils/db/RankUtils"
import Logger from "../../../../../utils/logs/Logger"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class EchoCommand extends BuckwheatCommand {
    override aliases: string[] = []
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

        const user = await ctx.vars.user.require()
        const isPrivate = ctx.chat.type == 'private'

        if (!other) {
            return {
                key: 'echo/no-text',
                options: {
                    vars: {
                        user
                    },
                    chatId
                }
            }
        }

        if (!isPrivate) {
            await MessageUtils.deleteMessages(ctx)
        }

        const text = MessageEntityUtils.messageToHtml(ctx.msg)
        Logger.log(`${user.username ? `@${user.username}` : user.name}(${user.id}) echoed ${text}`)
        return {
            key: 'echo/done',
            options: {
                chatId,
                vars: {
                    text
                }
            }
        }
    }
}