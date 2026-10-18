import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type NoteFolderChangePublicButtonData, NoteFolderChangePublicButtonDataSchema } from "../../../../protos/notes_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import NoteFolderService from "../../../../db/services/notes/NoteFolderService"

class NoteFolderChangePublicButton extends CallbackQueryAction<NoteFolderChangePublicButtonData> {
    override schema: GenMessage<NoteFolderChangePublicButtonData> = NoteFolderChangePublicButtonDataSchema
    override defaultTextKey: string = 'notes-folder/button/change-public'
    override minimumRank: number = RankUtils.min
    override settingId: number = 155
    override name: string = 'nfpub'
    
    protected override async _getId(options: CallbackQueryActionOptions<NoteFolderChangePublicButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<NoteFolderChangePublicButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data
        } = options

        const {
            folderId
        } = data

        const folder = await NoteFolderService.togglePublic(folderId)
        if(!folder) {
            return {
                key: 'notes-folder/message/not-exist'
            }
        }

        return {
            key: 'notes-folder/message/changed-public',
            vars: {
                isPublic: folder.isPublic
            }
        }
    }
}

export default new NoteFolderChangePublicButton()
