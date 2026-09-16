import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { InventoryGiftButtonDataSchema, type InventoryGiftButtonData } from "../../../../protos/inventory_pb"
import RankUtils from "../../../../utils/db/RankUtils"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"

class InventoryGiftButton extends CallbackQueryAction<InventoryGiftButtonData> {
    override defaultTextKey: string = 'inventory/button/gift'
    override schema: GenMessage<InventoryGiftButtonData> = InventoryGiftButtonDataSchema
    override minimumRank: number = RankUtils.min
    override settingId: number = 70
    override name: string = 'invgft'
    
    protected override async _execute(options: CallbackQueryActionOptions<InventoryGiftButtonData>): Promise<CallbackQueryExecuteResult> {
        const {

        } = options
    }
}

export default new InventoryGiftButton()