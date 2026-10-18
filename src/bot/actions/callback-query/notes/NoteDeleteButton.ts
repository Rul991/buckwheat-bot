import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type NoteDeleteButtonData, NoteDeleteButtonDataSchema } from "../../../../protos/notes_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import NoteService from "../../../../db/services/notes/NoteService"

class NoteDeleteButton extends CallbackQueryAction<NoteDeleteButtonData> {
    override schema: GenMessage<NoteDeleteButtonData> = NoteDeleteButtonDataSchema
    override defaultTextKey: string = 'button/delete'
    override minimumRank: number = RankUtils.min
    override settingId: number = 154
    override name: string = 'ndel'
    
    protected override async _getId(options: CallbackQueryActionOptions<NoteDeleteButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<NoteDeleteButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data
        } = options

        const {
            noteId
        } = data

        const isDeleted = await NoteService.delete(noteId)
        return {
            key: 'notes/message/delete-result',
            vars: {
                isDeleted
            }
        }
    }
}

export default new NoteDeleteButton()
