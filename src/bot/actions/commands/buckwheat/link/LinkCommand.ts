import LinkedChatService from "../../../../../db/services/chat/LinkedChatService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class LinkCommand extends BuckwheatCommand {
    override aliases: string[] = ['линк']
    override minimumRank: number = 0
    override name: string = 'привязать'
    override filename: string = 'link'
    override settingId: number = 13

    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            ctx,
            id
        } = options

        const isPrivate = ctx.chat.type == 'private'
        if(isPrivate) {
            return {
                key: 'link/private'
            }
        }
        const chat = ctx.chat.title

        const isSet = await LinkedChatService.set(id, ctx.chatId)

        return {
            key: 'link/set',
            options: {
                vars: {
                    isSet,
                    chat
                }
            }
        }
    }
}