import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import RankUtils from "../../../../utils/db/RankUtils"
import { ShopCountButtonDataSchema, type ShopCountButtonData } from "../../../../protos/shop_pb"

class ShopCountButton extends CallbackQueryAction<ShopCountButtonData> {
    override schema: GenMessage<ShopCountButtonData> = ShopCountButtonDataSchema
    override defaultTextKey: string = 'shop/button/buy'
    override minimumRank: number = RankUtils.min
    override settingId: number = 89
    override name: string = 'shopcnt'
    
    protected override async _execute(options: CallbackQueryActionOptions<ShopCountButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data
        } = options

        const {
            id,
            index,
            page
        } = data
    }
}

export default new ShopCountButton()