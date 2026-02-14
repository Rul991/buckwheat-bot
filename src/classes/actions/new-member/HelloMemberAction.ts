import AdminUtils from '../../../utils/AdminUtils'
import ContextUtils from '../../../utils/ContextUtils'
import MessageUtils from '../../../utils/MessageUtils'
import { DEV_ID } from '../../../utils/values/consts'
import { NewMemberOptions } from '../../../utils/values/types/action-options'
import { NewMemberContext } from '../../../utils/values/types/contexts'
import HelloService from '../../db/services/chat/HelloService'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import ChatSettingsService from '../../db/services/settings/ChatSettingsService'
import UserOldService from '../../db/services/user/UserOldService'
import LegacyInlineKeyboardManager from '../../main/LegacyInlineKeyboardManager'
import NewMemberAction from './NewMemberAction'

type ConditionMessageOptions = {
    isBot: boolean
    id: number
    botId: number
    ctx: NewMemberContext
    changeValues: Record<string, any>
}

export default class HelloMemberAction extends NewMemberAction {
    private async _sendConditionMessage({
        isBot,
        id,
        botId,
        ctx,
        changeValues
    }: ConditionMessageOptions) {
        if(isBot && id != botId) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/hello/bot.pug',
                {
                    changeValues
                }
            )

            return true
        }
        else if(isBot) {
            return true
        }
        else if(id == DEV_ID) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/hello/creator.pug',
                {
                    changeValues
                }
            )
            return true
        }

        return false
    }

    async execute({ ctx, chatId }: NewMemberOptions): Promise<void> {
        const botName = ctx.botInfo.first_name
        const botId = ctx.botInfo.id
        const chatName = 'title' in ctx.chat ? ctx.chat.title : botName
        
        for (const from of ctx.message.new_chat_members) {
            const id = from.id
            const name = from.first_name
            const isBot = from.is_bot

            const changeValues = await ContextUtils.getUser(
                chatId, 
                id, 
            )

            const isNeedSetOld = await this._sendConditionMessage({
                isBot,
                id,
                botId,
                ctx,
                changeValues
            })

            if(isNeedSetOld) {
                await UserOldService.update(chatId, id, true)
                continue
            }
            else {
                const isOld = await UserOldService.get(chatId, id)
                if(isOld) continue
            }

            const hasButton = await ChatSettingsService.get<'boolean'>(
                chatId,
                'oldCheck'
            )
            
            if(hasButton) {
                await AdminUtils.mute(ctx, id)
            }
            else {
                await UserOldService.update(chatId, id, true)
            }
            
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/commands/hello/hello.pug',
                {
                    changeValues: {
                        ...changeValues,
                        botName,
                        chatName,
                        chatId,
                        text: await HelloService.get(chatId),
                        hasButton
                    },
                    inlineKeyboard: hasButton ? await LegacyInlineKeyboardManager.get('verify', `${id}`) : undefined
                }
            )
        }
    }
}