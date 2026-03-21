import { number, object, ZodType } from 'zod'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import CallbackButtonAction from '../CallbackButtonAction'
import { idSchema } from '../../../utils/values/schemas'
import ContextUtils from '../../../utils/ContextUtils'
import FileUtils from '../../../utils/FileUtils'
import MessageUtils from '../../../utils/MessageUtils'

type Data = {
    id: number
    chatId: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = idSchema
        .and(object({
            chatId: number()
        }))

    constructor () {
        super()
        this._name = 'chatlink'
        this._buttonTitle = 'Чат: Ссылка'
    }

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            data,
            ctx,
            chatId: fromChatId
        } = options

        const {
            id,
            chatId
        } = data
        if(await ContextUtils.showAlertIfIdNotEqual(ctx, id)) return

        const chat = await ContextUtils.getChat(ctx, chatId)
        if (!chat) return await FileUtils.readPugFromResource(
            'text/commands/chats/no-chat.pug'
        )

        if (chat.type == 'private') {
            return await FileUtils.readPugFromResource(
                'text/commands/chats/private.pug'
            )
        }

        
        const link = 'username' in chat ?
            `t.me/${chat.username}` :
            (await ContextUtils.createInviteLink(
                ctx,
                chatId,
                {
                    creates_join_request: true,
                    name: `${fromChatId}:${id}`
                }
            ))?.invite_link

        if (!link) {
            return await FileUtils.readPugFromResource(
                'text/commands/chats/no-link.pug'
            )
        }

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/commands/chats/show-link.pug',
            {
                changeValues: {
                    title: chat.title,
                    link
                }
            }
        )
    }
}