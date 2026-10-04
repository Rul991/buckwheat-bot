import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type JoinChatButtonData, JoinChatButtonDataSchema } from "../../../../protos/new-chat-member_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import AdminUtils from "../../../../utils/bot/AdminUtils"
import UserService from "../../../../db/services/user/UserService"

class JoinChatButton extends CallbackQueryAction<JoinChatButtonData> {
    override schema: GenMessage<JoinChatButtonData> = JoinChatButtonDataSchema
    override defaultTextKey: string = 'new-chat-member/button/join'
    override minimumRank: number = RankUtils.min
    override settingId: number = 117
    override name: string = 'jc'

    protected override async _getId(options: CallbackQueryActionOptions<JoinChatButtonData>): Promise<number | number[] | undefined> {
        const {
            ctx
        } = options
        const id = Number(options.data.id)
        if (ctx.vars.id == id) {
            return id
        }

        const user = await ctx.vars.user.get()
        const rank = user?.rank ?? RankUtils.min
        const chatMember = await ctx.vars.chatMember.get()

        if (RankUtils.canUseWithoutRank(chatMember, ctx.vars.id)) {
            return undefined
        }

        if (rank >= RankUtils.admin) {
            return undefined
        }

        return id
    }

    protected override async _execute(options: CallbackQueryActionOptions<JoinChatButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            ctx,
            data,
            chatId
        } = options

        const id = Number(data.id)
        const chat = ctx.chat
        const user = id == ctx.vars.id ?
            await ctx.vars.user.get() :
            await UserService.get(chatId, id)

        await Promise.all([
            MessageUtils.editText(
                ctx,
                'new-chat-member/enter',
                {
                    vars: {
                        user,
                        chat
                    }
                }
            ),
            AdminUtils.unmute(ctx, id)
        ])
    }
}

export default new JoinChatButton()