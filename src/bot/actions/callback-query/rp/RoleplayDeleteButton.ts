import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { RoleplayDeleteButtonDataSchema, type RoleplayDeleteButtonData } from "../../../../protos/rp_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import RankUtils from "../../../../utils/db/RankUtils"
import RoleplayService from "../../../../db/services/rp/RoleplayService"

class RoleplayDeleteButton extends CallbackQueryAction<RoleplayDeleteButtonData> {
    override schema: GenMessage<RoleplayDeleteButtonData> = RoleplayDeleteButtonDataSchema
    override defaultTextKey: string = 'button/delete'
    override minimumRank: number = RankUtils.min + 2
    override settingId: number = 62
    override name: string = 'rpdel'

    protected override async _getId(options: CallbackQueryActionOptions<RoleplayDeleteButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }

    protected override async _execute(options: CallbackQueryActionOptions<RoleplayDeleteButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
        } = options

        const {
            objectId
        } = data

        const isDeleted = await RoleplayService.delete(
            objectId
        )
        if (!isDeleted) {
            return {
                key: 'rp/not-exist'
            }
        }

        return {
            key: 'rp/deleted'
        }
    }
}

export default new RoleplayDeleteButton()