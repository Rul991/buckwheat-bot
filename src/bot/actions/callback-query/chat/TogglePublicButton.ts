import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { TogglePublicButtonDataSchema, type TogglePublicButtonData } from "../../../../protos/chat_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import RankUtils from "../../../../utils/db/RankUtils"
import ChatService from "../../../../db/services/chat/ChatService"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import ChatUtils from "../../../../utils/chat/ChatUtils"

class TogglePublicButton extends CallbackQueryAction<TogglePublicButtonData> {
    override schema: GenMessage<TogglePublicButtonData> = TogglePublicButtonDataSchema
    override defaultTextKey: string = 'chat/button/toggle-public'
    override minimumRank: number = RankUtils.max
    override settingId: number = 81
    override name: string = 'pub'
    
    protected override async _execute(options: CallbackQueryActionOptions<TogglePublicButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            chatId,
            ctx
        } = options
        
        const chat = await ChatService.togglePublic(chatId)
        if(!chat) {
            return {
                key: 'chat/not-exist'
            }
        }

        const {
            key,
            options: messageOptions
        } = await ChatUtils.message(ctx, chat)

        await MessageUtils.editText(
            ctx,
            key,
            messageOptions
        )

        return {
            key: 'chat/toggled-public',
            vars: {
                result: chat.isPublic
            }
        }
    }
}

export default new TogglePublicButton()