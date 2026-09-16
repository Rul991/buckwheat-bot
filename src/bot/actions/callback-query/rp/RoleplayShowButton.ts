import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import { RoleplayShowButtonDataSchema, type RoleplayShowButtonData } from "../../../../protos/rp_pb"
import RankUtils from "../../../../utils/db/RankUtils"
import RoleplayService from "../../../../db/services/rp/RoleplayService"
import RoleplayUtils from "../../../../utils/rp/RoleplayUtils"
import MessageUtils from "../../../../utils/bot/MessageUtils"

class RoleplayShowButton extends CallbackQueryAction<RoleplayShowButtonData> {
    override schema: GenMessage<RoleplayShowButtonData> = RoleplayShowButtonDataSchema
    override defaultTextKey: string = 'rp/button/show'
    override minimumRank: number = RankUtils.min
    override settingId: number = 59
    override name: string = 'rpshow'

    protected override async _getId(options: CallbackQueryActionOptions<RoleplayShowButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<RoleplayShowButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            ctx,
            id
        } = options

        const {
            objectId,
            page
        } = data

        const roleplay = await RoleplayService.get(
            objectId
        )
        if(!roleplay) {
            return {
                key: 'rp/not-exist'
            }
        }

        const result = await RoleplayUtils.showMessage({
            roleplay,
            page,
            ctx,
            id
        })
        const {
            key,
            options: messageOptions
        } = result!

        await MessageUtils.editText(
            ctx,
            key,
            messageOptions
        )
    }
}

export default new RoleplayShowButton()