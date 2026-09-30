import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import { type ExportImportShowButtonData, ExportImportShowButtonDataSchema } from "../../../../protos/export-import_pb"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import ExportImportManager from "../../../../utils/data/ExportImportManager"
import { showExportImportKeyboard } from "../../../keyboards/export-import"

class ExportImportShowButton extends CallbackQueryAction<ExportImportShowButtonData> {
    override schema: GenMessage<ExportImportShowButtonData> = ExportImportShowButtonDataSchema
    override defaultTextKey: string = 'export-import/button/show'
    override minimumRank: number = RankUtils.min
    override settingId: number = 108
    override name: string = 'eishw'

    protected override async _getId(options: CallbackQueryActionOptions<ExportImportShowButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<ExportImportShowButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            ctx,
            id
        } = options

        const {
            definitionId,
            page
        } = data

        const definition = ExportImportManager.get(definitionId)
        if(!definition) {
            return {
                key: 'export-import/message/no-definition'
            }
        }

        await MessageUtils.editText(
            ctx,
            'export-import/message/show',
            {
                vars: {
                    definition: definition.getVars(ctx)
                },
                keyboard: await showExportImportKeyboard(
                    ctx,
                    {
                        id,
                        page,
                        definition
                    }
                )
            }
        )
    }
}

export default new ExportImportShowButton()