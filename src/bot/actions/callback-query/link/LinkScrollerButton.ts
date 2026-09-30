import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { InlineKeyboard } from "grammy"
import { type LinkScrollerButtonData, LinkScrollerButtonDataSchema } from "../../../../protos/link_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { ScrollerButtonEditMessageOptions } from "../../../../types/options"
import type { ScrollerButtonEditMessageResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import ScrollerButton from "../scroller/ScrollerButton"
import LinkedChatService from "../../../../db/services/chat/LinkedChatService"
import ChatService from "../../../../db/services/chat/ChatService"
import type Chat from "../../../../db/entities/chat/Chat"
import LinkButton from "./LinkButton"

class LinkScrollerButton extends ScrollerButton<Chat, LinkScrollerButtonData> {
    override schema: GenMessage<LinkScrollerButtonData> = LinkScrollerButtonDataSchema
    override minimumRank: number = RankUtils.min
    override settingId: number = 112
    override name: string = 'links'

    protected override _isNeedCache: boolean = true
    protected override _objectsPerPage: number = 5
    
    protected override async _getRawObjects(options: CallbackQueryActionOptions<LinkScrollerButtonData>): Promise<Chat[]> {
        const {
            id
        } = options

        const linkedChat = await LinkedChatService.get(id)
        const linkedChats = linkedChat?.linkedChats ?? []
        const chats = await ChatService.getByIds(linkedChats)
        return chats.values().toArray()
    }

    protected override async _getKeyboard(options: ScrollerButtonEditMessageOptions<Chat, LinkScrollerButtonData>): Promise<InlineKeyboard> {
        const keyboard = new InlineKeyboard()
        const {
            slicedObjects: chats,
            ctx,
            id,
        } = options
        const bigId = BigInt(id)

        chats.forEach((chat, index) => {
            keyboard.add(
                LinkButton.button({
                    ctx,
                    data: {
                        id: bigId,
                        index
                    },
                    vars: {
                        chat
                    }
                })
            )
        })

        return keyboard.toFlowed(1)
    }

    protected override async _editMessage(_options: ScrollerButtonEditMessageOptions<Chat, LinkScrollerButtonData>): Promise<ScrollerButtonEditMessageResult> {
        return {
            key: 'link/private'
        }
    }
}

export default new LinkScrollerButton()