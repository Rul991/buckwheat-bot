import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type LinkButtonData, LinkButtonDataSchema } from "../../../../protos/link_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import LinkedChatService from "../../../../db/services/chat/LinkedChatService"
import ChatService from "../../../../db/services/chat/ChatService"
import { UNKNOWN_NAME } from "../../../../consts/texts"

class LinkButton extends CallbackQueryAction<LinkButtonData> {
    override schema: GenMessage<LinkButtonData> = LinkButtonDataSchema
    override defaultTextKey: string = 'link/button/link'
    override minimumRank: number = RankUtils.min
    override settingId: number = 112
    override name: string = 'link'

    protected override async _getId(options: CallbackQueryActionOptions<LinkButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<LinkButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            id
        } = options

        const {
            index
        } = data

        const linkedChatValue = await LinkedChatService.get(id)
        const linkedChats = linkedChatValue?.linkedChats ?? []
        const linkedChat = linkedChats[index]
        if(linkedChat === undefined) return {
            key: 'link/message/not-exist'
        }

        const isSet = await LinkedChatService.set(
            id,
            linkedChat
        )
        const chat = await ChatService.get(linkedChat)

        return {
            key: 'link/message/set',
            vars: {
                chat: {
                    title: chat?.title ?? UNKNOWN_NAME
                },
                isSet
            }
        }
    }
}

export default new LinkButton()