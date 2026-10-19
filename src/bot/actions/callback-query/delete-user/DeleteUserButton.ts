import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type DeleteUserButtonData, DeleteUserButtonDataSchema } from "../../../../protos/delete-user_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import UserService from "../../../../db/services/user/UserService"
import TotalService from "../../../../db/services/total/TotalService"
import MessageUtils from "../../../../utils/bot/MessageUtils"

class DeleteUserButton extends CallbackQueryAction<DeleteUserButtonData> {
    override schema: GenMessage<DeleteUserButtonData> = DeleteUserButtonDataSchema
    override defaultTextKey: string = 'delete-user/button/button'
    override minimumRank: number = RankUtils.max
    override settingId: number = 158
    override name: string = 'dub'
    
    protected override async _getId(options: CallbackQueryActionOptions<DeleteUserButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<DeleteUserButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            ctx,
            data,
            chatId
        } = options

        const {
            deletedUserId: rawDeletedUserId
        } = data

        const meId = ctx.me.id
        const deletedUserId = rawDeletedUserId ? Number(rawDeletedUserId) : undefined
        const user = deletedUserId ? await UserService.get(chatId, deletedUserId) : undefined

        if(deletedUserId) {
            await TotalService.deleteUser(
                chatId,
                deletedUserId
            )
        }
        else {
            await Promise.all([
                TotalService.deleteUnactiveUsers(chatId, meId),
                MessageUtils.deleteMessages(ctx)
            ])
        }

        return {
            key: 'delete-user/message/deleted',
            vars: {
                user
            }
        }
    }
}

export default new DeleteUserButton()
