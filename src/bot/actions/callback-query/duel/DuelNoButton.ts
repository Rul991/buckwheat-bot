import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type DuelNoButtonData, DuelNoButtonDataSchema } from "../../../../protos/duels_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import UserService from "../../../../db/services/user/UserService"

class DuelNoButton extends CallbackQueryAction<DuelNoButtonData> {
    override schema: GenMessage<DuelNoButtonData> = DuelNoButtonDataSchema
    override defaultTextKey: string = 'duel/button/no'
    override minimumRank: number = RankUtils.min
    override settingId: number = 190
    override name: string = 'duelno'

    protected override async _getId(options: CallbackQueryActionOptions<DuelNoButtonData>): Promise<number | number[] | undefined> {
        const {
            data
        } = options

        const {
            suggesterId,
            replyId
        } = data

        return [
            Number(suggesterId),
            Number(replyId),
        ]
    }

    protected override async _execute(options: CallbackQueryActionOptions<DuelNoButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            ctx,
            id,
            chatId
        } = options
        
        const suggesterId = Number(data.suggesterId)
        const isSuggester = suggesterId == id

        const user = await ctx.vars.user.get()
        const suggester = isSuggester ?
            user :
            await UserService.get(chatId, suggesterId)

        await Promise.all([
            MessageUtils.deleteMessages(ctx),
            MessageUtils.reply(
                ctx,
                'duel/message/deny',
                {
                    vars: {
                        user,
                        suggester,
                        isSuggester
                    }
                }
            )
        ])
    }
}

export default new DuelNoButton()
