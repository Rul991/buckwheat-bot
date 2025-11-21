import AdminUtils from '../../../utils/AdminUtils'
import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import { DEV_ID } from '../../../utils/values/consts'
import { NewMemberContext } from '../../../utils/values/types'
import HelloService from '../../db/services/chat/HelloService'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import UserOldService from '../../db/services/user/UserOldService'
import InlineKeyboardManager from '../../main/InlineKeyboardManager'
import NewMemberAction from './NewMemberAction'

export default class HelloMemberAction extends NewMemberAction {
    async execute(ctx: NewMemberContext): Promise<void> {
        const chatId = await LinkedChatService.getCurrent(ctx)
        if(!chatId) return

        const botName = ctx.botInfo.first_name
        const botId = ctx.botInfo.id
        const chatName = 'title' in ctx.chat ? ctx.chat.title : botName
        
        for (const from of ctx.message.new_chat_members) {
            let isNeedSetOld = false
            
            const id = from.id
            const name = from.first_name
            const isBot = from.is_bot

            const changeValues = await ContextUtils.getUser(
                chatId, 
                id, 
                name
            )

            if(isBot && id != botId) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/hello/bot.pug',
                    {
                        changeValues
                    }
                )

                isNeedSetOld = true
            }
            else if(isBot) {
                isNeedSetOld = true
            }
            else if(id == DEV_ID) {
                await MessageUtils.answerMessageFromResource(
                    ctx,
                    'text/commands/hello/creator.pug',
                    {
                        changeValues
                    }
                )
                isNeedSetOld = true
            }

            if(isNeedSetOld) {
                await UserOldService.update(chatId, id, true)
                continue
            }

            const isOld = await UserOldService.get(chatId, id)
            if(isOld) continue
            
            await AdminUtils.mute(ctx, id)
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/hello/hello.pug',
                {
                    changeValues: {
                        ...changeValues,
                        botName,
                        chatName,
                        chatId,
                        text: await HelloService.get(chatId)
                    },
                    inlineKeyboard: await InlineKeyboardManager.get('verify', `${id}`)
                }
            )
        }
    }
}