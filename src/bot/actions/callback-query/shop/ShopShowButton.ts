import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { ShopShowButtonDataSchema, type ShopShowButtonData } from "../../../../protos/shop_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import RankUtils from "../../../../utils/db/RankUtils"
import { shopItems } from "../../../../resources/items/shop"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import ShopUtils from "../../../../utils/items/ShopUtils"

class ShopShowButton extends CallbackQueryAction<ShopShowButtonData> {
    override schema: GenMessage<ShopShowButtonData> = ShopShowButtonDataSchema
    override defaultTextKey: string = 'shop/button/show'
    override minimumRank: number = RankUtils.min
    override settingId: number = 87
    override name: string = 'shopshw'

    protected override async _getId(options: CallbackQueryActionOptions<ShopShowButtonData>): Promise<number | number[] | undefined> {
        return Number(options.data.id)
    }
    
    protected override async _execute(options: CallbackQueryActionOptions<ShopShowButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            ctx,
        } = options

        const {
            index,
            page,
            count
        } = data

        const item = shopItems[index]
        if(!item) {
            return {
                key: 'shop/not-exist'
            }
        }

        const {
            key,
            options: messageOptions
        } = await ShopUtils.message({
            ctx,
            item,
            count,
            page,
            index
        })

        await MessageUtils.editText(
            ctx,
            key,
            messageOptions
        )
    }
}

export default new ShopShowButton()