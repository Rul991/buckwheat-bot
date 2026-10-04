import { showShopKeyboard } from "../../bot/keyboards/shop"
import InventoryItemService from "../../db/services/items/InventoryItemService"
import type { BotContext } from "../../types/bot"
import type Item from "./Item"

type MessageOptions = {
    ctx: BotContext
    item: Item
    count: number
    page: number
    index: number
    remainingCount?: number
}

export default class ShopUtils {
    static async message({
        ctx,
        item,
        count: chooseCount,
        page,
        index,
        remainingCount
    }: MessageOptions) {
        const chatId = ctx.vars.chatId!
        const id = ctx.vars.id!

        const balance = await ctx.vars.balance.get()
        const money = balance?.total ?? 0

        const inventoryItem = await InventoryItemService.get({
            chatId,
            id,
            item
        })

        const price = item.basePrice
        const count = {
            choose: chooseCount,
            current: inventoryItem?.count ?? 0,
            remaining: remainingCount ?? await InventoryItemService.getRemainingCount({
                chatId,
                id,
                item
            })
        }

        return {
            key: 'shop/show',
            options: {
                vars: {
                    item: item.getVars(ctx),
                    balance: money,
                    price,
                    count
                },
                keyboard: await showShopKeyboard(
                    ctx,
                    {
                        page,
                        id,
                        remainingCount: count.remaining,
                        index,
                        count: chooseCount
                    }
                )
            }
        }
    }
}