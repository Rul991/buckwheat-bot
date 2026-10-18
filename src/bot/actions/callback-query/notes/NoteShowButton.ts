import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type NoteShowButtonData, NoteShowButtonDataSchema } from "../../../../protos/notes_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import NoteService from "../../../../db/services/notes/NoteService"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import NoteFolderService from "../../../../db/services/notes/NoteFolderService"
import UserService from "../../../../db/services/user/UserService"
import { showNoteKeyboard } from "../../../keyboards/notes"

class NoteShowButton extends CallbackQueryAction<NoteShowButtonData> {
    override schema: GenMessage<NoteShowButtonData> = NoteShowButtonDataSchema
    override defaultTextKey: string = 'notes/button/show'
    override minimumRank: number = RankUtils.min
    override settingId: number = 152
    override name: string = 'nsh'
    
    protected override async _getId(options: CallbackQueryActionOptions<NoteShowButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<NoteShowButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            ctx,
            id,
            chatId
        } = options

        const {
            page,
            noteId
        } = data

        const note = await NoteService.get(noteId)
        if(!note) {
            return {
                key: 'notes/message/not-exist'
            }
        }

        const folder = await NoteFolderService.get(note.folderId)
        if(!folder) {
            return {
                key: 'notes-folder/message/not-exist'
            }
        }

        const owner = await UserService.get(
            chatId,
            folder.owner
        )

        await MessageUtils.editText(
            ctx,
            'notes/message/show',
            {
                vars: {
                    note,
                    folder,
                    owner
                },
                keyboard: await showNoteKeyboard(
                    ctx,
                    {
                        id,
                        note,
                        page,
                        owner: folder.owner
                    }
                )
            }
        )
    }
}

export default new NoteShowButton()
