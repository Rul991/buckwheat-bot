import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { InlineKeyboard } from "grammy"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { ScrollerButtonEditMessageOptions } from "../../../../types/options"
import type { ScrollerButtonEditMessageResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import ScrollerButton from "../scroller/ScrollerButton"
import { type PublicChatScrollerButtonData, PublicChatScrollerButtonDataSchema } from "../../../../protos/chat_pb"
import ChatService from "../../../../db/services/chat/ChatService"
import type Chat from "../../../../db/entities/chat/Chat"
import PublicChatLinkButton from "./PublicChatLinkButton"

class PublicChatScrollerButton extends ScrollerButton<Chat, PublicChatScrollerButtonData> {
    override schema: GenMessage<PublicChatScrollerButtonData> = PublicChatScrollerButtonDataSchema
    override minimumRank: number = RankUtils.min
    override settingId: number = 132
    override name: string = 'pcscr'

    protected override _isNeedCache: boolean = true
    protected override _objectsPerPage: number = 5
    
    protected override async _getRawObjects(_options: CallbackQueryActionOptions<PublicChatScrollerButtonData>): Promise<Chat[]> {
        return await ChatService.getPublicChats()
    }

    protected override async _getKeyboard(options: ScrollerButtonEditMessageOptions<Chat, PublicChatScrollerButtonData>): Promise<InlineKeyboard> {
        const keyboard = new InlineKeyboard()
        const {
            slicedObjects: chats,
            ctx,
            id,
        } = options
        const bigId = BigInt(id)

        for (const chat of chats) {
            keyboard.add(PublicChatLinkButton.button({
                ctx,
                vars: {
                    chat
                },
                data: {
                    chatId: BigInt(chat.id),
                    id: bigId
                }
            }))
        }

        return keyboard.toFlowed(1)
    }

    protected override async _editMessage(_options: ScrollerButtonEditMessageOptions<Chat, PublicChatScrollerButtonData>): Promise<ScrollerButtonEditMessageResult> {
        return {
            key: 'chat/public/start'
        }
    }
}

export default new PublicChatScrollerButton()