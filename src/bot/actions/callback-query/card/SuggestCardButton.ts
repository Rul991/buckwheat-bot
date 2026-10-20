import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { type SuggestCardButtonData, SuggestCardButtonDataSchema } from "../../../../protos/card_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import SuggestCardConversation from "../../conversations/card/SuggestCardConversation"

class SuggestCardButton extends CallbackQueryAction<SuggestCardButtonData> {
    override schema: GenMessage<SuggestCardButtonData> = SuggestCardButtonDataSchema
    override defaultTextKey: string = 'card/button/suggest'
    override minimumRank: number = RankUtils.min
    override settingId: number = 161
    override name: string = 'sugcard'
    
    protected override async _getId(options: CallbackQueryActionOptions<SuggestCardButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<SuggestCardButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            ctx
        } = options

        await SuggestCardConversation.enter(ctx)
    }
}

export default new SuggestCardButton()
