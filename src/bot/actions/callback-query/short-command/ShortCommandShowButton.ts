import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type ShortCommandShowButtonData, ShortCommandShowButtonDataSchema } from "../../../../protos/short-command_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import CommandUtils from "../../../../utils/command/CommandUtils"
import ShortCommandService from "../../../../db/services/short/ShortCommandService"
import { showShortCommandKeyboard } from "../../../keyboards/short-command"

class ShortCommandShowButton extends CallbackQueryAction<ShortCommandShowButtonData> {
    override schema: GenMessage<ShortCommandShowButtonData> = ShortCommandShowButtonDataSchema
    override defaultTextKey: string = 'shorten/button/show'
    override minimumRank: number = RankUtils.min
    override settingId: number = 125
    override name: string = 'scsh'

    protected override async _getId(options: CallbackQueryActionOptions<ShortCommandShowButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }

    protected override async _execute(options: CallbackQueryActionOptions<ShortCommandShowButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            ctx,
            id
        } = options

        const {
            command,
            page,
        } = data

        const shortCommand = await ShortCommandService.get(command)
        if(!shortCommand) {
            return {
                key: 'shorten/not-exist'
            }
        }

        await MessageUtils.editText(
            ctx,
            'shorten/show',
            {
                vars: {
                    shortCommand,
                    botNames: CommandUtils.botNames
                },
                keyboard: await showShortCommandKeyboard(
                    ctx,
                    {
                        id,
                        page,
                        shortCommand
                    }
                )
            })
    }
}

export default new ShortCommandShowButton()