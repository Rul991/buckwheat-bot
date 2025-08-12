import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import { NewMemberContext } from '../../../utils/types'
import HelloService from '../../db/services/chat/HelloService'
import UserNameService from '../../db/services/user/UserNameService'
import NewMemberAction from './NewMemberAction'

export default class HelloMemberAction extends NewMemberAction {
    async execute(ctx: NewMemberContext): Promise<void> {
        const botName = ctx.botInfo.first_name

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/hello/hello.pug',
            {
                changeValues: {
                    link: ContextUtils.getLinkUrl(ctx.from.id),
                    name: await UserNameService.get(ctx.from.id) ?? ctx.from.first_name,
                    botName,
                    chatName: 'title' in ctx.chat ? ctx.chat.title : botName,
                    chatId: ctx.chat.id,
                    text: await HelloService.get()
                }
            }
        )
    }
}