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

        for (const from of ctx.message.new_chat_members) {
            if(from.is_bot) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/hello/bot.pug',
                    {
                        changeValues: {
                            link: ContextUtils.getLinkUrl(from.id)
                        }
                    }
                )
                return
            }

            const isOld = await UserOldService.get(from.id)
            if(isOld) return
            
            await AdminUtils.mute(ctx, from.id)
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/hello/hello.pug',
                {
                    changeValues: {
                        ...await ContextUtils.getUser(from.id, from.first_name),
                        botName,
                        chatName: 'title' in ctx.chat ? ctx.chat.title : botName,
                        chatId: ctx.chat.id,
                        text: await HelloService.get()
                    },
                    inlineKeyboard: ['verify', `${from.id}`]
                }
            )
        }
    }
}