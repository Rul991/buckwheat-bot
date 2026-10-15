import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type PublicChatLinkButtonData, PublicChatLinkButtonDataSchema } from "../../../../protos/chat_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import ContextUtils from "../../../../utils/bot/ContextUtils"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import TimeUtils from "../../../../utils/time/TimeUtils"
import { CHAT_LINK_EXPIRE_DATE } from "../../../../consts/time"
import ChatService from "../../../../db/services/chat/ChatService"

class PublicChatLinkButton extends CallbackQueryAction<PublicChatLinkButtonData> {
    override schema: GenMessage<PublicChatLinkButtonData> = PublicChatLinkButtonDataSchema
    override defaultTextKey: string = 'chat/button/link'
    override minimumRank: number = RankUtils.min
    override settingId: number = 133
    override name: string = 'pclink'

    protected override async _getId(options: CallbackQueryActionOptions<PublicChatLinkButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<PublicChatLinkButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            ctx
        } = options

        const {
            chatId: rawChatId
        } = data

        const chatId = Number(rawChatId)
        const user = await ctx.vars.user.require()

        const currentChat = await ctx.vars.chat.get()
        const chat = currentChat?.id == chatId ? currentChat : await ChatService.get(chatId)
        if(!chat) {
            return {
                key: 'chat/not-exist'
            }
        }

        if(!chat.isPublic) {
            return {
                key: 'chat/public/not-public',
                vars: {
                    chat
                }
            }
        }

        const link = (await ContextUtils.createInviteLink(
            ctx,
            chatId,
            {
                key: 'chat/public/link-name',
                vars: {
                    chat: currentChat,
                    user
                }
            }
        ))?.invite_link

        if(!link) {
            return {
                key: 'chat/public/cant-create',
                vars: {
                    chat
                }
            }
        }

        await MessageUtils.reply(
            ctx,
            'chat/public/created',
            {
                vars: {
                    user,
                    expireTime: TimeUtils.formatMillisecondsToTime(
                        ctx,
                        CHAT_LINK_EXPIRE_DATE
                    ),
                    chat,
                    link
                }
            }
        )
    }
}

export default new PublicChatLinkButton()