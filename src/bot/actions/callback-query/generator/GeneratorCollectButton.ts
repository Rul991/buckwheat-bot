import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import { type GeneratorCollectButtonData, GeneratorCollectButtonDataSchema } from "../../../../protos/generator_pb"
import GeneratorService from "../../../../db/services/generator/GeneratorService"
import GeneratorUtils from "../../../../utils/generator/GeneratorUtils"
import MessageUtils from "../../../../utils/bot/MessageUtils"

class GeneratorCollectButton extends CallbackQueryAction<GeneratorCollectButtonData> {
    override schema: GenMessage<GeneratorCollectButtonData> = GeneratorCollectButtonDataSchema
    override defaultTextKey: string = 'generator/button/collect'
    override minimumRank: number = RankUtils.min
    override settingId: number = 136
    override name: string = 'gc'

    protected override async _getId(options: CallbackQueryActionOptions<GeneratorCollectButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<GeneratorCollectButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            ctx,
            chatId,
            id
        } = options

        const income = await GeneratorService.collect(chatId, id)

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
            key: 'generator/message/collected',
            vars: {
                income
            }
        }
    }
}

export default new GeneratorCollectButton()