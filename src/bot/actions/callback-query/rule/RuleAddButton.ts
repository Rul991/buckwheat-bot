import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { RuleAddButtonDataSchema, type RuleAddButtonData } from "../../../../protos/rule_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import RankUtils from "../../../../utils/db/RankUtils"
import AddRuleConversation from "../../conversations/rule/AddRuleConversation"

class RuleAddButton extends CallbackQueryAction<RuleAddButtonData> {
    override schema: GenMessage<RuleAddButtonData> = RuleAddButtonDataSchema
    override defaultTextKey: string = 'button/add'
    override minimumRank: number = RankUtils.admin
    override settingId: number = 66
    override name: string = 'ruleadd'

    protected override async _getId(options: CallbackQueryActionOptions<RuleAddButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<RuleAddButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            ctx,
        } = options

        await AddRuleConversation.enter(
            ctx
        )
    }
}

export default new RuleAddButton()