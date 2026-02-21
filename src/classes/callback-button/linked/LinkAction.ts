import { number, object, ZodType } from 'zod'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import CallbackButtonAction from '../CallbackButtonAction'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import FileUtils from '../../../utils/FileUtils'
import ChatService from '../../db/services/chat/ChatService'

type Data = {
    chat: number
}

export default class extends CallbackButtonAction<Data> {
    protected _schema: ZodType<Data> = object({
        chat: number()
    })

    constructor () {
        super()
        this._name = 'link'
        this._buttonTitle = 'Привязать'
    }

    async execute(options: CallbackButtonOptions<Data>): Promise<string | void> {
        const {
            id,
            data,
            ctx,
            chatId: currentChatId
        } = options

        const {
            chat: chatId
        } = data

        if(currentChatId == chatId) {
            return await FileUtils.readPugFromResource(
                'text/commands/link/already.pug'
            )
        }

        const linkedChats = await LinkedChatService.getLinkedChats(id)
        const inChat = linkedChats.some(v => v == chatId)

        if (!inChat) {
            return await FileUtils.readPugFromResource(
                'text/commands/link/not-in-chat.pug'
            )
        }

        await LinkedChatService.set(
            id,
            chatId
        )

        const chatName = await ChatService.getName(chatId)
        return await FileUtils.readPugFromResource(
            'text/commands/link/done-alert.pug',
            {
                changeValues: {
                    chatName
                }
            }
        )
    }
}