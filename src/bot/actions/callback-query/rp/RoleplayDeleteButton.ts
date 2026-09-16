import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { RoleplayDeleteButtonDataSchema, type RoleplayDeleteButtonData } from "../../../../protos/rp_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import RankUtils from "../../../../utils/db/RankUtils"
import RoleplayService from "../../../../db/services/rp/RoleplayService"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import { backRoleplayKeyboard } from "../../../keyboards/rp"

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
            ctx,
            id
        } = options

        const {
            page,
            objectId
        } = data

        const roleplay = await RoleplayService.delete(
            objectId
        )
        if (!roleplay) {
            return {
                key: 'rp/not-exist'
            }
        }

        await MessageUtils.editText(
            ctx,
            'rp/deleted',
            {
                keyboard: await backRoleplayKeyboard(
                    ctx,
                    {
                        id,
                        page
                    }
                )
            }
        )
    }
}

export default new RoleplayDeleteButton()