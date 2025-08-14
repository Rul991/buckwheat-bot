import AdminUtils from '../../../utils/AdminUtils'
import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import { NewMemberContext } from '../../../utils/types'
import HelloService from '../../db/services/chat/HelloService'
import NewMemberAction from './NewMemberAction'

export default class HelloMemberAction extends NewMemberAction {
    async execute(ctx: NewMemberContext): Promise<void> {
        const botName = ctx.botInfo.first_name

        await AdminUtils.mute(ctx, ctx.from.id, 0)
        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/hello/hello.pug',
            {
                changeValues: {
                    ...await ContextUtils.getUser(ctx.from.id, ctx.from.first_name),
                    botName,
                    chatName: 'title' in ctx.chat ? ctx.chat.title : botName,
                    chatId: ctx.chat.id,
                    text: await HelloService.get()
                },
                inlineKeyboard: ['verify', `${ctx.from.id}`]
            }
        )
    }
}