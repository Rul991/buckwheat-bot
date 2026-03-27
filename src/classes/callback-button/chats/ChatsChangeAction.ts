import Chat from '../../../interfaces/schemas/chat/Chat'
import { CallbackButtonOptions } from '../../../utils/values/types/action-options'
import { NewScrollerData, ScrollerEditMessageOptions, ScrollerEditMessageResult } from '../../../utils/values/types/scrollers'
import ChatService from '../../db/services/chat/ChatService'
import ScrollerAction from '../scrollers/new/ScrollerAction'

type Object = Chat

type Additional = {

}

export default class extends ScrollerAction<Object, Additional> {
    protected _keyboardFilename: string = 'chats/change'

    constructor() {
        super()
        this._name = 'chatschange'
        this._buttonTitle = 'Чаты: Пролистывание'
    }

    protected async _getRawObjects(_: CallbackButtonOptions<NewScrollerData<Additional>>): Promise<Object[]> {
        return await ChatService.getAllByPublic()
    }

    protected async _editMessage(options: ScrollerEditMessageOptions<Object, Additional>): Promise<ScrollerEditMessageResult> {
        const {
            slicedObjects,
            id,
            objects
        } = options
        const count = objects.length

        return {
            keyboard: {
                values: {
                    chats: slicedObjects.map(chat => {
                        return {
                            text: chat.name ?? chat.id.toString(),
                            data: {
                                chatId: chat.id,
                                id
                            }
                        }
                    })
                }
            },

            message: {
                path: 'text/commands/chats/chats.pug',
                changeValues: {
                    count
                }
            }
        }
    }
}