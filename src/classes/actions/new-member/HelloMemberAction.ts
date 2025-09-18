import AdminUtils from '../../../utils/AdminUtils'
import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import { DEV_ID } from '../../../utils/values/consts'
import { NewMemberContext } from '../../../utils/values/types'
import HelloService from '../../db/services/chat/HelloService'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import UserOldService from '../../db/services/user/UserOldService'
import CallbackButtonManager from '../../main/CallbackButtonManager'
import NewMemberAction from './NewMemberAction'

export default class HelloMemberAction extends NewMemberAction {
    async execute(ctx: NewMemberContext): Promise<void> {
        const chatId = await LinkedChatService.getCurrent(ctx)
        if(!chatId) return
        const botName = ctx.botInfo.first_name

        for (const from of ctx.message.new_chat_members) {
            const changeValues = await ContextUtils.getUser(
                ctx.chat.id, 
                from.id, 
                from.first_name
            )

            if(from.is_bot && from.id != ctx.botInfo.id) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/hello/bot.pug',
                    {
                        changeValues
                    }
                )
                return
            }
            else if(from.is_bot) return
            else if(from.id == DEV_ID) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/hello/creator.pug',
                    {
                        changeValues
                    }
                )
                return
            }

            const isOld = await UserOldService.get(chatId, from.id)
            if(isOld) return
            
            await AdminUtils.mute(ctx, from.id)
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/hello/hello.pug',
                {
                    changeValues: {
                        ...changeValues,
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