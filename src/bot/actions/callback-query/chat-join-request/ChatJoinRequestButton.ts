import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type ChatJoinRequestButtonData, ChatJoinRequestButtonDataSchema } from "../../../../protos/chat-join-request_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import UserService from "../../../../db/services/user/UserService"
import ContextUtils from "../../../../utils/bot/ContextUtils"
import User from "../../../../db/entities/user/User"
import MessageUtils from "../../../../utils/bot/MessageUtils"

class ChatJoinRequestButton extends CallbackQueryAction<ChatJoinRequestButtonData> {
    override schema: GenMessage<ChatJoinRequestButtonData> = ChatJoinRequestButtonDataSchema
    override defaultTextKey: string = 'chat-join-request/button'
    override minimumRank: number = RankUtils.moderator
    override settingId: number = 119
    override name: string = 'cjr'

    protected override async _execute(options: CallbackQueryActionOptions<ChatJoinRequestButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            chatId,
            ctx
        } = options

        const {
            isAccept,
            id: rawId
        } = data

        const requesterId = Number(rawId)
        const requester = await UserService.get(chatId, requesterId) ?? User.dummy()
        const user = await ctx.vars.user.get()

        if (isAccept) {
            await ContextUtils.approveChatJoinRequest(
                ctx,
                requesterId
            )
        }
        else {
            await ContextUtils.declineChatJoinRequest(
                ctx,
                requesterId
            )
        }

        await MessageUtils.deleteMessages(ctx)
        await MessageUtils.reply(
            ctx,
            'chat-join-request/accept',
            {
                vars: {
                    user,
                    requester,
                    isAccept
                }
            }
        )
    }
}

export default new ChatJoinRequestButton()