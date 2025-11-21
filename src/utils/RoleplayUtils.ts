import LinkedChatService from '../classes/db/services/linkedChat/LinkedChatService'
import ContextUtils from './ContextUtils'
import FileUtils from './FileUtils'
import { MaybeString, TextContext } from './values/types'

export default class RoleplayUtils {
    static async getMessage(ctx: TextContext, text: string, other?: MaybeString): Promise<string> {
            const dummyId = 0
            const reply = ctx.message.reply_to_message?.from ?? 
                {
                    ...ctx.from,
                    first_name: '',
                    id: dummyId
                }
            const hasReply = reply.id != dummyId && reply.id != ctx.botInfo.id
            const chatId = await LinkedChatService.getCurrent(ctx)
            if(!chatId) return await FileUtils.readPugFromResource('text/actions/other/no-chat-id.pug')
    
            return await FileUtils.readPugFromResource(
                'text/commands/other/rp.pug',
                {
                    changeValues: {
                        text,
                        user: await ContextUtils.getUser(
                            chatId, 
                            ctx.from.id, 
                            ctx.from.first_name
                        ),
                        reply: await ContextUtils.getUser(
                            chatId, 
                            reply.id, 
                            reply.first_name
                        ),
                        hasReply,
                        other
                    }
                }
            )
        }
}