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
import type Item from "../../../../utils/items/Item"
import type { BotContext } from "../../../../types/bot"
import { freeBuyItem } from "../../../../resources/items/inventory"
import BusinessStockService from "../../../../db/services/business/BusinessStockService"
import BusinessService from "../../../../db/services/business/BusinessService"

type BuyOptions = {
    chatId: number
    id: number
    shopItem: Item
    count: number
    ctx: BotContext
    useCoupon: boolean
}

class ShopBuyButton extends CallbackQueryAction<ShopBuyButtonData> {
    override schema: GenMessage<ShopBuyButtonData> = ShopBuyButtonDataSchema
    override defaultTextKey: string = 'shop/button/buy'
    override minimumRank: number = RankUtils.min
    override settingId: number = 89
    override name: string = 'shopbuy'

    private async _buy({
        shopItem,
        count,
        chatId,
        id,
        ctx,
        useCoupon
    }: BuyOptions) {
        const totalPrice = shopItem.basePrice * count
        const current = await BalanceService.get(chatId, id)
        const money = current?.total ?? 0

        if (useCoupon) {
            if (money < totalPrice) {
                return { key: 'shop/not-enough-money', vars: { totalPrice, money } }
            }

            const useResult = await InventoryItemService.use({
                chatId,
                id,
                item: freeBuyItem,
                count: 1,
                ctx
            })

            if (useResult.ok) {
                await InventoryItemService.add({ chatId, id, item: shopItem, count })
                return
            }

            return {
                key: 'shop/no-coupon'
            }
        }
        else {
            const spent = await BalanceService.trySpend({ chatId, id, money: totalPrice })

            if (!spent) {
                return { key: 'shop/not-enough-money', vars: { totalPrice, money } }
            }

            const shop = await BusinessService.createBuckwheat({
                ctx,
                type: 'shop'
            })

            ctx.vars.balance.set(spent)
            await Promise.all([
                InventoryItemService.add({ chatId, id, item: shopItem, count }),
                BusinessStockService.income(shop.id, totalPrice)
            ])
        }
    }

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
            page,
            useCoupon
        } = data

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

        const buyResult = await this._buy({
            chatId,
            id,
            ctx,
            shopItem,
            count,
            useCoupon
        })
        if (buyResult) {
            return buyResult
        }

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