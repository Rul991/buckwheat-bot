import { backMarketKeyboard, showMarketKeyboard } from "../../bot/keyboards/market"
import type MarketSlot from "../../db/entities/market/MarketSlot"
import UserService from "../../db/services/user/UserService"
import type { BotContext } from "../../types/bot"
import ItemUtils from "../items/ItemUtils"

type ShopOptions = {
    slot: MarketSlot
    count: number
    ctx: BotContext
    page: number
}

type BoughtOptions = {
    ctx: BotContext
    id: number
    page: number
}

export default class MarketSlotUtils {
    static async show(options: ShopOptions) {
        const {
            ctx,
            count,
            slot,
            page
        } = options

        const id = ctx.vars.id
        const chatId = ctx.vars.chatId!

        const item = ItemUtils.get(slot.itemId)
        if (!item) {
            return {
                key: 'inventory/not-exist',
                options: {
                    vars: {
                        totally: true
                    }
                }
            }
        }

        const seller = await UserService.get(chatId, slot.seller)
        const balance = await ctx.vars.balance.require()
        return {
            key: 'market/message/show',
            options: {
                vars: {
                    seller,
                    slot,
                    count,
                    item: {
                        ...item,
                        ...item.getVars(ctx)
                    },
                    balance: balance.total
                },
                keyboard: await showMarketKeyboard(
                    ctx,
                    {
                        id,
                        page,
                        slot,
                        currentCount: count
                    }
                )
            }
        }
    }

    static async bought({
        ctx,
        id,
        page
    }: BoughtOptions) {
        return {
            key: 'market/message/bought',
            options: {
                keyboard: await backMarketKeyboard(
                    ctx,
                    {
                        id,
                        page
                    }
                )
            }
        }
    }
}