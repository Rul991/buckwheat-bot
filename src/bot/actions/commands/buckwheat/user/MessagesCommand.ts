import MessagesService from "../../../../../db/services/message/MessagesService"
import UserService from "../../../../../db/services/user/UserService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import RankUtils from "../../../../../utils/db/RankUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class MessagesCommand extends BuckwheatCommand {
    override aliases: string[] = ['соо', 'сообщение']
    override minimumRank: number = RankUtils.min
    override settingId: number = 50
    override name: string = 'сообщения'
    override isSupportReply: boolean = true
    override filename: string = 'messages'
    
    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            chatId,
            id,
            replyOrUserFrom,
            ctx
        } = options

        const messages = await MessagesService.getAllByUser(chatId, replyOrUserFrom.id)
        const user = id == replyOrUserFrom.id ?
            await ctx.vars.user.get() : 
            await UserService.get(chatId, replyOrUserFrom.id)

        return {
            key: 'messages/info',
            options: {
                vars: {
                    messages,
                    user
                }
            }
        }
    }
}