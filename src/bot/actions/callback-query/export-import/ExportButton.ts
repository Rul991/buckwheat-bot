import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type ExportButtonData, ExportButtonDataSchema } from "../../../../protos/export-import_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import ExportImportManager from "../../../../utils/data/ExportImportManager"
import JsonUtils from "../../../../utils/string/JsonUtils"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import { SettingValueTypes } from "../../../../protos/settings_pb"
import type { BotContext } from "../../../../types/bot"
import Setting from "../../../../utils/settings/Setting"

class ExportButton extends CallbackQueryAction<ExportButtonData> {
    override schema: GenMessage<ExportButtonData> = ExportButtonDataSchema
    override defaultTextKey: string = 'export/button'
    override minimumRank: number = RankUtils.min
    override settingId: number = 109
    override name: string = 'exp'

    protected override async _getRankSetting(ctx: BotContext<ExportButtonData>): Promise<Setting<"enum", SettingValueTypes> | undefined> {
        const data = ctx.actionData
        const definition = ExportImportManager.get(data.definitionId)
        if (!definition) return super._getRankSetting(ctx)

        const forChat = definition.forChat
        if (!forChat) {
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

    protected override async _getId(options: CallbackQueryActionOptions<ExportButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }

    protected override async _execute(options: CallbackQueryActionOptions<ExportButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            chatId,
            id,
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

        const value = await definition.exportCallback({
            chatId,
            id,
            ctx
        })
        const jsonValue = JsonUtils.stringify(value)
        const user = await ctx.vars.user.get()

        await MessageUtils.replyTextAsDocument(
            ctx,
            jsonValue,
            {
                filename: `${definition.key}.json`,
                key: 'export/exported',
                vars: {
                    definition: definition.getVars(ctx),
                    user
                }
            }
        )
    }
}

export default new ExportButton()