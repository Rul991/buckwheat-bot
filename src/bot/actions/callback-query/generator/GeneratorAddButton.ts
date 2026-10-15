import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type GeneratorAddButtonData, GeneratorAddButtonDataSchema } from "../../../../protos/generator_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import GeneratorService from "../../../../db/services/generator/GeneratorService"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import GeneratorUtils from "../../../../utils/generator/GeneratorUtils"

class GeneratorAddButton extends CallbackQueryAction<GeneratorAddButtonData> {
    override schema: GenMessage<GeneratorAddButtonData> = GeneratorAddButtonDataSchema
    override defaultTextKey: string = 'generator/button/add'
    override minimumRank: number = RankUtils.min
    override settingId: number = 137
    override name: string = 'ga'

    protected override async _getId(options: CallbackQueryActionOptions<GeneratorAddButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }

    protected override async _execute(options: CallbackQueryActionOptions<GeneratorAddButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            chatId,
            ctx,
            id,
        } = options

        const addResult = await GeneratorService.add(chatId, id)
        const {
            ok,
            reason,
            count
        } = addResult

        if (!ok) {
            return {
                key: `generator/reason/${reason}`
            }
        }

        const {
            key,
            options: messageOptions
        } = await GeneratorUtils.show(ctx)

        await MessageUtils.editText(
            ctx,
            key,
            messageOptions
        )

        return {
            key: 'generator/message/added',
            vars: {
                count
            }
        }
    }
}

export default new GeneratorAddButton()