import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type GeneratorUpgradeButtonData, GeneratorUpgradeButtonDataSchema } from "../../../../protos/generator_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import GeneratorService from "../../../../db/services/generator/GeneratorService"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import GeneratorUtils from "../../../../utils/generator/GeneratorUtils"

class GeneratorUpgradeButton extends CallbackQueryAction<GeneratorUpgradeButtonData> {
    override schema: GenMessage<GeneratorUpgradeButtonData> = GeneratorUpgradeButtonDataSchema
    override defaultTextKey: string = 'generator/button/upgrade'
    override minimumRank: number = RankUtils.min
    override settingId: number = 138
    override name: string = 'gu'

    protected override async _getId(options: CallbackQueryActionOptions<GeneratorUpgradeButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }

    protected override async _execute(options: CallbackQueryActionOptions<GeneratorUpgradeButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            chatId,
            ctx,
            id,
        } = options

        const upgradeResult = await GeneratorService.upgrade(chatId, id)
        const {
            ok,
            reason,
            count
        } = upgradeResult

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
            key: 'generator/message/upgraded',
            vars: {
                count
            }
        }
    }
}

export default new GeneratorUpgradeButton()