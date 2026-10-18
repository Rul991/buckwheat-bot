import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type NoteFolderAddButtonData, NoteFolderAddButtonDataSchema } from "../../../../protos/notes_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import NoteFolderAddConversation from "../../conversations/notes/NoteFolderAddConversation"

class NoteFolderAddButton extends CallbackQueryAction<NoteFolderAddButtonData> {
    override schema: GenMessage<NoteFolderAddButtonData> = NoteFolderAddButtonDataSchema
    override defaultTextKey: string = 'button/add'
    override minimumRank: number = RankUtils.min
    override settingId: number = 150
    override name: string = 'nfadd'
    
    protected override async _getId(options: CallbackQueryActionOptions<NoteFolderAddButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<NoteFolderAddButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            ctx
        } = options
        await NoteFolderAddConversation.enter(ctx)
    }
}

export default new NoteFolderAddButton()
