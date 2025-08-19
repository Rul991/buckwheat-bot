import ContextUtils from '../../../utils/ContextUtils'
import FileUtils from '../../../utils/FileUtils'
import MessageUtils from '../../../utils/MessageUtils'
import { MaybeString, TextContext } from '../../../utils/types'
import SimpleBuckwheatCommand from './SimpleBuckwheatCommand'

export default class RoleplayCommand extends SimpleBuckwheatCommand {
    static async loadFromJsonResource(path: string): Promise<RoleplayCommand> {
        return await super.loadFromJsonResource(path) as RoleplayCommand
    }

    protected async _sendMessageBySrc(ctx: TextContext, src: string): Promise<void> {
        const text = await FileUtils.readTextFromResource(src)
        await this._sendMessageByText(ctx, text)
    }

    protected async _sendMessageByText(ctx: TextContext, text: string): Promise<void> {
        const dummyId = 0

        const reply = ctx.message.reply_to_message?.from ?? 
            {
                ...ctx.from,
                first_name: '',
                id: dummyId
            }

        const hasReply = reply.id != dummyId

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/rp.pug',
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

    async execute(ctx: TextContext, other: MaybeString): Promise<void> {
        super.execute(ctx, other)
    }
}