import EveryMessageAction from './EveryMessageAction'
import LinkedChatService from '../../db/services/linkedChat/LinkedChatService'
import { EveryMessageOptions } from '../../../utils/values/types/action-options'
import MessageUtils from '../../../utils/MessageUtils'
import ChatService from '../../db/services/chat/ChatService'

export default class WrongChatAction extends EveryMessageAction {
    constructor () {
        super()
        this._canUsePrivate = true
    }

    async execute({ ctx, chatMember, id }: EveryMessageOptions): Promise<void | true> {
        if (ctx.chat.type != 'private') return

        const linkedChat = await LinkedChatService.getRaw(id)
        const hasntLinkedChat = !linkedChat

        const isNotInChat = !chatMember ||
            chatMember.status == 'kicked' ||
            chatMember.status == 'left' ||
            chatMember.status == 'restricted'

        if (!(isNotInChat || hasntLinkedChat)) {
            return
        }

        if (isNotInChat) {
            if (linkedChat) {
                await LinkedChatService.remove(
                    id,
                    linkedChat
                )
            }
        }
        
        const linkedChats = await LinkedChatService.getLinkedChats(id)
        if (!linkedChats.length) {
            await MessageUtils.answerMessageFromResource(
                ctx,
                'text/every-action/wrong-chat.pug'
            )
            return true
        }
        
        const newChat = linkedChats[0]
        const chatName = await ChatService.getName(newChat)
        await LinkedChatService.set(
            id,
            newChat
        )

        await MessageUtils.answerMessageFromResource(
            ctx,
            'text/every-action/changed-linked.pug',
            {
                changeValues: {
                    chatName
                }
            }
        )

        return true
    }
}