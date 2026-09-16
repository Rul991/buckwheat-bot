import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { RoleplayEditTextButtonDataSchema, type RoleplayEditTextButtonData } from "../../../../protos/rp_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import RankUtils from "../../../../utils/db/RankUtils"
import EditTextRoleplayConversation from "../../conversations/rp/EditTextRoleplayConversation"
import RoleplayService from "../../../../db/services/rp/RoleplayService"

class RoleplayEditTextButton extends CallbackQueryAction<RoleplayEditTextButtonData> {
    override schema: GenMessage<RoleplayEditTextButtonData> = RoleplayEditTextButtonDataSchema
    override defaultTextKey: string = 'rp/button/edit-text'
    override minimumRank: number = RankUtils.min + 2
    override settingId: number = 60
    override name: string = 'rpedit'

    protected override async _getId(options: CallbackQueryActionOptions<RoleplayEditTextButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }

    protected override async _execute(options: CallbackQueryActionOptions<RoleplayEditTextButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            ctx,
            data,
        } = options

        const {
            objectId
        } = data

        const roleplay = await RoleplayService.get(objectId)
        if(!roleplay) {
            return {
                key: 'rp/not-exist'
            }
        }

        await EditTextRoleplayConversation.enter(ctx, roleplay)
    }
}

export default new RoleplayEditTextButton()