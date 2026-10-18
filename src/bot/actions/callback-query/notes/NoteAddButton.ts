import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type NoteAddButtonData, NoteAddButtonDataSchema } from "../../../../protos/notes_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import NoteAddConversation from "../../conversations/notes/NoteAddConversation"

class NoteAddButton extends CallbackQueryAction<NoteAddButtonData> {
    override schema: GenMessage<NoteAddButtonData> = NoteAddButtonDataSchema
    override defaultTextKey: string = 'button/add'
    override minimumRank: number = RankUtils.min
    override settingId: number = 151
    override name: string = 'nadd'
    
    protected override async _getId(options: CallbackQueryActionOptions<NoteAddButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<NoteAddButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            ctx
        } = options

        const {
            folderId
        } = data

        await NoteAddConversation.enter(
            ctx,
            {
                folderId
            }
        )
    }
}

export default new NoteAddButton()
