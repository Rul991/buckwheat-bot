import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type DeleteButtonData, DeleteButtonDataSchema } from "../../../../protos/proto_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import MessageUtils from "../../../../utils/bot/MessageUtils"

class DeleteButton extends CallbackQueryAction<DeleteButtonData> {
    override schema: GenMessage<DeleteButtonData> = DeleteButtonDataSchema
    override defaultTextKey: string = 'button/delete'
    override minimumRank: number = RankUtils.min
    override settingId: number = 192
    override name: string = 'del'
    
    protected override async _getId(options: CallbackQueryActionOptions<DeleteButtonData>): Promise<number | number[] | undefined> {
        return options.data.id ? Number(options.data.id) : undefined
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<DeleteButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            ctx
        } = options

        await MessageUtils.deleteMessages(ctx)
    }
}

export default new DeleteButton()
