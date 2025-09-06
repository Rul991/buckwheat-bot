import AdminUtils from '../../../utils/AdminUtils'
import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import { NewMemberContext } from '../../../utils/values/types'
import HelloService from '../../db/services/chat/HelloService'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import UserOldService from '../../db/services/user/UserOldService'
import CallbackButtonManager from '../../main/CallbackButtonManager'
import NewMemberAction from './NewMemberAction'

export default class HelloMemberAction extends NewMemberAction {
    async execute(ctx: NewMemberContext): Promise<void> {
        const botName = ctx.botInfo.first_name
        const chatId = await LinkedChatService.getChatId(ctx)
        if(!chatId) return

        for (const from of ctx.message.new_chat_members) {
            if(from.is_bot && from.id != ctx.botInfo.id) {
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
            else if(from.is_bot) return

            const isOld = await UserOldService.get(chatId, from.id)
            if(isOld) return
            
            await AdminUtils.mute(ctx, from.id)
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/hello/hello.pug',
                {
                    changeValues: {
                        ...await ContextUtils.getUser(chatId, from.id, from.first_name),
                        botName,
                        chatName: 'title' in ctx.chat ? ctx.chat.title : botName,
                        chatId,
                        text: await HelloService.get(chatId)
                    },
                    inlineKeyboard: await CallbackButtonManager.get('verify', `${from.id}`)
                }
            )
        }
    }
}