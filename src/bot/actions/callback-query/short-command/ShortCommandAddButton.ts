import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import { type ShortCommandAddButtonData, ShortCommandAddButtonDataSchema } from "../../../../protos/short-command_pb"
import ShortCommandAddConversation from "../../conversations/short-command/ShortCommandAddConversation"

class ShortCommandAddButton extends CallbackQueryAction<ShortCommandAddButtonData> {
    override schema: GenMessage<ShortCommandAddButtonData> = ShortCommandAddButtonDataSchema
    override defaultTextKey: string = 'button/add'
    override minimumRank: number = RankUtils.min
    override settingId: number = 174
    override name: string = 'scadd'
    
    protected override async _getId(options: CallbackQueryActionOptions<ShortCommandAddButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<ShortCommandAddButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            ctx
        } = options

        await ShortCommandAddConversation.enter(ctx)
    }
}

export default new ShortCommandAddButton()
