import AdminUtils from '../../../utils/AdminUtils'
import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import { NewMemberContext } from '../../../utils/values/types'
import HelloService from '../../db/services/chat/HelloService'
import UserOldService from '../../db/services/user/UserOldService'
import NewMemberAction from './NewMemberAction'

export default class HelloMemberAction extends NewMemberAction {
    async execute(ctx: NewMemberContext): Promise<void> {
        const botName = ctx.botInfo.first_name
        const isOld = await UserOldService.get(ctx.from.id)

        if(isOld) return
        
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