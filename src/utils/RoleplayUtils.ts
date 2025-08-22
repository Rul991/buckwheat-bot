import ContextUtils from './ContextUtils'
import FileUtils from './FileUtils'
import { TextContext } from './values/types'

export default class RoleplayUtils {
    static async getMessage(ctx: TextContext, text: string): Promise<string> {
            const dummyId = 0
            const reply = ctx.message.reply_to_message?.from ?? 
                {
                    ...ctx.from,
                    first_name: '',
                    id: dummyId
                }
            const hasReply = reply.id != dummyId
    
            return await FileUtils.readPugFromResource(
                'text/commands/other/rp.pug',
                {
                    changeValues: {
                        text,
                        user: await ContextUtils.getUser(
                            ctx.from.id, 
                            ctx.from.first_name
                        ),
                        reply: await ContextUtils.getUser(
                            reply.id, 
                            reply.first_name
                        ),
                        hasReply
                    }
                }
            )
        }
}