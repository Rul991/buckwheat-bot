import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { RoleplayChangeCaseButtonDataSchema, type RoleplayChangeCaseButtonData } from "../../../../protos/rp_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import RankUtils from "../../../../utils/db/RankUtils"
import RoleplayService from "../../../../db/services/rp/RoleplayService"
import RoleplayUtils from "../../../../utils/rp/RoleplayUtils"
import MessageUtils from "../../../../utils/bot/MessageUtils"

class RoleplayChangeCaseButton extends CallbackQueryAction<RoleplayChangeCaseButtonData> {
    override schema: GenMessage<RoleplayChangeCaseButtonData> = RoleplayChangeCaseButtonDataSchema
    override defaultTextKey: string = 'rp/button/case'
    override minimumRank: number = RankUtils.min + 2
    override settingId: number = 58
    override name: string = 'rpcase'

    protected override async _getId(options: CallbackQueryActionOptions<RoleplayChangeCaseButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<RoleplayChangeCaseButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            id,
            ctx,
        } = options

        const {
            caseValue,
            objectId,
            page
        } = data

        const roleplay = await RoleplayService.changeCase(
            objectId,
            caseValue
        )
        if(!roleplay) {
            return {
                key: 'rp/not-exist'
            }
        }

        const {
            key,
            options: messageOptions
        } = (await RoleplayUtils.showMessage({
            roleplay,
            id,
            page,
            ctx
        }))!

        await MessageUtils.editText(
            ctx,
            key,
            messageOptions
        )

        return {
            key: 'rp/case-changed',
            vars: {
                caseValue
            }
        }
    }
}

export default new RoleplayChangeCaseButton()