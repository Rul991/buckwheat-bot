import LinkedChatService from '../classes/db/services/linkedChat/LinkedChatService'
import ContextUtils from './ContextUtils'
import FileUtils from './FileUtils'
import { MaybeString } from './values/types/types'
import { MessageContext } from './values/types/contexts'

export default class RoleplayUtils {
    static async getMessage(ctx: MessageContext, text: string, other?: MaybeString): Promise<string> {
            const dummyId = 0
            const dummyFrom = {
                    ...ctx.from,
                    first_name: '',
                    id: dummyId
                }
            const reply = 'reply_to_message' in ctx.message ? 
                ctx.message.reply_to_message?.from ?? dummyFrom :
                dummyFrom
                
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