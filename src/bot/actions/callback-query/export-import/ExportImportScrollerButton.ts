import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { InlineKeyboard } from "grammy"
import { type ExportImportScrollerButtonData, ExportImportScrollerButtonDataSchema } from "../../../../protos/export-import_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { ScrollerButtonEditMessageOptions } from "../../../../types/options"
import type { ScrollerButtonEditMessageResult } from "../../../../types/results"
import type ExportImportDefinition from "../../../../utils/data/ExportImportDefinition"
import RankUtils from "../../../../utils/db/RankUtils"
import ScrollerButton from "../scroller/ScrollerButton"
import ExportImportManager from "../../../../utils/data/ExportImportManager"
import ExportImportShowButton from "./ExportImportShowButton"

class ExportImportScrollerButton extends ScrollerButton<ExportImportDefinition<any>, ExportImportScrollerButtonData> {
    override schema: GenMessage<ExportImportScrollerButtonData> = ExportImportScrollerButtonDataSchema
    override minimumRank: number = RankUtils.min
    override settingId: number = 107
    override name: string = 'eiscr'

    protected override _isNeedCache: boolean = false
    protected override _objectsPerPage: number = 5
    
    protected override async _getRawObjects(_options: CallbackQueryActionOptions<ExportImportScrollerButtonData>): Promise<ExportImportDefinition<any>[]> {
        return ExportImportManager.getAll()
    }

    protected override async _getKeyboard(options: ScrollerButtonEditMessageOptions<ExportImportDefinition<any>, ExportImportScrollerButtonData>): Promise<InlineKeyboard> {
        const keyboard = new InlineKeyboard()
        const {
            slicedObjects,
            ctx,
            id,
            page
        } = options
        const bigId = BigInt(id)

        for (const definition of slicedObjects) {
            keyboard.add(
                ExportImportShowButton.button({
                    ctx,
                    vars: {
                        definition: definition.getVars(ctx)
                    },
                    data: {
                        id: bigId,
                        page,
                        definitionId: definition.id
                    }
                })
            )
        }

        return keyboard.toFlowed(1)
    }

    protected override async _editMessage(options: ScrollerButtonEditMessageOptions<ExportImportDefinition<any>, ExportImportScrollerButtonData>): Promise<ScrollerButtonEditMessageResult> {
        const {

        } = options

        return {
            key: 'export-import/message/start'
        }
    }
}

export default new ExportImportScrollerButton()