import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type ImportButtonData, ImportButtonDataSchema } from "../../../../protos/export-import_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import ExportImportManager from "../../../../utils/data/ExportImportManager"
import ImportConversation from "../../conversations/import/ImportConversation"
import { SettingValueTypes } from "../../../../protos/settings_pb"
import type { BotContext } from "../../../../types/bot"
import Setting from "../../../../utils/settings/Setting"

class ImportButton extends CallbackQueryAction<ImportButtonData> {
    override schema: GenMessage<ImportButtonData> = ImportButtonDataSchema
    override defaultTextKey: string = 'import/button'
    override minimumRank: number = RankUtils.max
    override settingId: number = 110
    override name: string = 'imp'

    protected override async _getRankSetting(ctx: BotContext<ImportButtonData>): Promise<Setting<"enum", SettingValueTypes> | undefined> {
        const data = ctx.actionData
        const definition = ExportImportManager.get(data.definitionId)
        if(!definition) return super._getRankSetting(ctx)

        const forChat = definition.forChat
        if(!forChat) {
            return new Setting({
                type: 'enum',
                valueType: SettingValueTypes.Button,
                default: RankUtils.min.toString(),
                id: 1000 + this.settingId,
                properties: {
                    values: []
                },
                textKey: ''
            })
        }

        return super._getRankSetting(ctx)
    }

    protected override async _getId(options: CallbackQueryActionOptions<ImportButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }

    protected override async _execute(options: CallbackQueryActionOptions<ImportButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            ctx
        } = options

        const {
            definitionId
        } = data

        const definition = ExportImportManager.get(definitionId)
        if (!definition) {
            return {
                key: 'export-import/message/no-definition'
            }
        }

        await ImportConversation.enter(
            ctx,
            definitionId
        )
    }
}

export default new ImportButton()