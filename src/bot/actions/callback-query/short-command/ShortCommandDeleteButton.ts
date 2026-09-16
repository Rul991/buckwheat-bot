import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { ShortCommandDeleteButtonDataSchema, type ShortCommandDeleteButtonData } from "../../../../protos/short-command_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import RankUtils from "../../../../utils/db/RankUtils"
import ShortCommandService from "../../../../db/services/short/ShortCommandService"

class ShortCommandDeleteButton extends CallbackQueryAction<ShortCommandDeleteButtonData> {
    override schema: GenMessage<ShortCommandDeleteButtonData> = ShortCommandDeleteButtonDataSchema
    override defaultTextKey: string = 'button/delete'

    override minimumRank: number = RankUtils.min
    override settingId: number = 83
    override name: string = 'scdel'

    protected override async _getId(options: CallbackQueryActionOptions<ShortCommandDeleteButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }

    protected override async _execute(options: CallbackQueryActionOptions<ShortCommandDeleteButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data: {
                command
            }
        } = options

        const shortCommand = await ShortCommandService.delete(
            command
        )
        const isDeleted = shortCommand.deletedCount > 0

        if(!isDeleted) {
            return {
                key: 'shorten/not-exist'
            }
        }

        return {
            key: 'shorten/deleted',
            vars: {
                command
            }
        }
    }
}

export default new ShortCommandDeleteButton()