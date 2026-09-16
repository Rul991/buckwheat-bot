import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import type Rule from "../../../../db/entities/chat/Rule"
import { RuleScrollerButtonDataSchema, type RuleScrollerButtonData } from "../../../../protos/rule_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { ScrollerButtonEditMessageOptions } from "../../../../types/options"
import type { ScrollerButtonEditMessageResult } from "../../../../types/results"
import ScrollerButton from "../scroller/ScrollerButton"
import RankUtils from "../../../../utils/db/RankUtils"
import RuleService from "../../../../db/services/chat/RuleService"
import { InlineKeyboard } from "grammy"
import RuleDeleteButton from "./RuleDeleteButton"

class RuleScrollerButton extends ScrollerButton<Rule, RuleScrollerButtonData> {
    override schema: GenMessage<RuleScrollerButtonData> = RuleScrollerButtonDataSchema
    override minimumRank: number = RankUtils.min
    override settingId: number = 64
    override name: string = 'rulescr'
    protected override _objectsPerPage: number = 1

    protected override async _getKeyboard(options: ScrollerButtonEditMessageOptions<Rule, RuleScrollerButtonData>): Promise<InlineKeyboard> {
        const {
            ctx,
            id,
            slicedObjects: [rule]
        } = options
        if(!rule) return new InlineKeyboard()

        const keyboard = new InlineKeyboard()
        const bigId = BigInt(id)
        const ruleId = rule.id

        const [canDelete] = await RuleDeleteButton.checkRank(ctx)
        if(canDelete) {
            keyboard
                .add(RuleDeleteButton.button({
                    ctx,
                    data: {
                        id: bigId,
                        ruleId
                    },
                    style: 'danger'
                }))
                .row()
        }

        return keyboard
    }
    
    protected override async _getRawObjects(options: CallbackQueryActionOptions<RuleScrollerButtonData>): Promise<Rule[]> {
        const {
            chatId
        } = options

        return await RuleService.getAllByChatId(chatId)
    }

    protected override async _editMessage(options: ScrollerButtonEditMessageOptions<Rule, RuleScrollerButtonData>): Promise<ScrollerButtonEditMessageResult> {
        const {
            slicedObjects: [rule],
            page
        } = options

        if(!rule) return {
            key: 'rule/not-exist'
        }

        return {
            key: 'rule/show',
            vars: {
                page,
                rule
            }
        }
    }
}

export default new RuleScrollerButton()