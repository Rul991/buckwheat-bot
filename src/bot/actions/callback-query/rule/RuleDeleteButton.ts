import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { RuleDeleteButtonDataSchema, type RuleDeleteButtonData } from "../../../../protos/rule_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import RankUtils from "../../../../utils/db/RankUtils"
import RuleService from "../../../../db/services/chat/RuleService"

class RuleDeleteButton extends CallbackQueryAction<RuleDeleteButtonData> {
    override schema: GenMessage<RuleDeleteButtonData> = RuleDeleteButtonDataSchema
    override defaultTextKey: string = 'button/delete'
    override minimumRank: number = RankUtils.admin
    override settingId: number = 65
    override name: string = 'ruledel'

    protected override async _getId(options: CallbackQueryActionOptions<RuleDeleteButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<RuleDeleteButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            chatId,
            data
        } = options

        const {
            ruleId
        } = data

        const isDelete = await RuleService.delete(chatId, ruleId)

        return {
            key: 'rule/delete-result',
            vars: {
                isDelete
            }
        }
    }
}

export default new RuleDeleteButton()