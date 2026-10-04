import type { GenMessage } from "@bufbuild/protobuf/codegenv2"
import { ShopBuyButtonDataSchema, type ShopBuyButtonData } from "../../../../protos/shop_pb"
import type { CallbackQueryActionOptions } from "../../../../types/action-options"
import type { CallbackQueryExecuteResult } from "../../../../types/results"
import CallbackQueryAction from "../../base/CallbackQueryAction"
import RankUtils from "../../../../utils/db/RankUtils"
import { shopItems } from "../../../../resources/items/shop"
import InventoryItemService from "../../../../db/services/items/InventoryItemService"
import MessageUtils from "../../../../utils/bot/MessageUtils"
import ShopUtils from "../../../../utils/items/ShopUtils"
import BalanceService from "../../../../db/services/money/BalanceService"

class ShopBuyButton extends CallbackQueryAction<ShopBuyButtonData> {
    override schema: GenMessage<ShopBuyButtonData> = ShopBuyButtonDataSchema
    override defaultTextKey: string = 'shop/button/buy'
    override minimumRank: number = RankUtils.min
    override settingId: number = 89
    override name: string = 'shopbuy'

    protected override async _execute(options: CallbackQueryActionOptions<ShopBuyButtonData>): Promise<CallbackQueryExecuteResult> {
        const {
            data,
            chatId,
            id,
            ctx
        } = options

        const {
            index,
            count,
            page
        } = data
        const botId = ctx.me.id

        const shopItem = shopItems[index]
        if (!shopItem) {
            return {
                key: 'shop/not-exist.pug'
            }
        }

        const remainingCount = await InventoryItemService.getRemainingCount({
            chatId,
            id,
            item: shopItem
        })

        if (count > remainingCount) {
            return {
                key: 'shop/too-many-count',
                vars: {
                    remainingCount
                }
            }
        }

        const totalPrice = shopItem.basePrice * count
        const spent = await BalanceService.trySpend({ chatId, id, money: totalPrice })

        if (!spent) {
            const current = await ctx.vars.balance.require()
            return { key: 'shop/not-enough-money', vars: { totalPrice, money: current.total } }
        }

        await Promise.all([
            InventoryItemService.add({ chatId, id, item: shopItem, count }),
            BalanceService.add({ chatId, id: botId, money: totalPrice })
        ])

        const {
            key,
            options: messageOptions
        } = await ShopUtils.message({
            ctx,
            item: shopItem,
            count,
            page,
            index,
            remainingCount
        })

        await MessageUtils.editText(
            ctx,
            key,
            messageOptions
        )

        return {
            key: 'shop/bought',
            vars: {
                item: shopItem.getVars(ctx),
                count
            }
        }
    }
}

export default new ShopBuyButton()