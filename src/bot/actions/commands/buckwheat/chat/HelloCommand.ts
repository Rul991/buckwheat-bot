import { MAX_USER_TEXT_LENGTH } from "../../../../../consts/lengths"
import ChatService from "../../../../../db/services/chat/ChatService"
import type { BuckwheatCommandOptions } from "../../../../../types/action-options"
import type { BuckwheatCommandExecuteResult } from "../../../../../types/results"
import MessageEntityUtils from "../../../../../utils/bot/MessageEntityUtils"
import RankUtils from "../../../../../utils/db/RankUtils"
import BuckwheatCommand from "../../../base/BuckwheatCommand"

export default class HelloCommand extends BuckwheatCommand {
    override aliases: string[] = ['привет']
    override minimumRank: number = RankUtils.min + 2
    override settingId: number = 48
    override name: string = 'приветствие'
    override filename: string = 'hello'
    override needData: boolean = true
    
    override async execute(options: BuckwheatCommandOptions): Promise<BuckwheatCommandExecuteResult> {
        const {
            chatId,
            ctx,
            other
        } = options

        if(!other) {
            return {
                key: 'hello/current-hello',
                options: {
                    vars: {
                        hello: ctx.vars.chat?.hello
                    }
                }
            }
        }

        const message = ctx.msg
        const newHello = MessageEntityUtils.messageToHtml({
            ...message,
            text: message.text.slice(0, MAX_USER_TEXT_LENGTH)
        })

        await ChatService.update(
            chatId,
            {
                hello: newHello
            }
        )

        return {
            key: 'hello/new-hello'
        }
    }
}