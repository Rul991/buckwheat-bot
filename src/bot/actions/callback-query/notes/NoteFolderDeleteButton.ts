import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type NoteFolderDeleteButtonData, NoteFolderDeleteButtonDataSchema } from "../../../../protos/notes_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import NoteFolderService from "../../../../db/services/notes/NoteFolderService"

class NoteFolderDeleteButton extends CallbackQueryAction<NoteFolderDeleteButtonData> {
    override schema: GenMessage<NoteFolderDeleteButtonData> = NoteFolderDeleteButtonDataSchema
    override defaultTextKey: string = 'button/delete'
    override minimumRank: number = RankUtils.min
    override settingId: number = 153
    override name: string = 'nfdel'

    protected override async _getId(options: CallbackQueryActionOptions<NoteFolderDeleteButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }

    protected override async _execute(options: CallbackQueryActionOptions<NoteFolderDeleteButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data
        } = options

        const {
            folderId
        } = data

        const isDeleted = await NoteFolderService.delete(folderId)
        return {
            key: 'notes-folder/message/delete-result',
            vars: {
                isDeleted
            }
        }
    }
}

export default new NoteFolderDeleteButton()
