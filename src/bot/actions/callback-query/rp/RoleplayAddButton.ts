import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { RoleplayAddButtonDataSchema, type RoleplayAddButtonData } from "../../../../protos/rp_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import RankUtils from "../../../../utils/db/RankUtils"
import AddRoleplayConversation from "../../conversations/rp/AddRoleplayConversation"

class RoleplayAddButton extends CallbackQueryAction<RoleplayAddButtonData> {
    override schema: GenMessage<RoleplayAddButtonData> = RoleplayAddButtonDataSchema
    override defaultTextKey: string = 'rp/button/add'
    override minimumRank: number = RankUtils.min + 2
    override settingId: number = 57
    override name: string = 'rpadd'

    protected override async _getId(options: CallbackQueryActionOptions<RoleplayAddButtonData>): Promise<number | number[] | undefined> {
        const id = options.data.id
        return Number(id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<RoleplayAddButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            ctx
        } = options

        await AddRoleplayConversation.enter(ctx)
    }
}

export default new RoleplayAddButton()