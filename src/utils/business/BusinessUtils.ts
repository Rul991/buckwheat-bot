import { businessMarketShowKeyboard } from "../../bot/keyboards/business"
import { MAX_BUSINESS_STAKES } from "../../consts/number"
import type Business from "../../db/entities/business/Business"
import type BusinessStockMarketSlot from "../../db/entities/business/BusinessStockMarketSlot"
import UserService from "../../db/services/user/UserService"
import type { BotContext } from "../../types/bot"
import type { BusinessType } from "../../types/business"

type ShowMarketOptions = {
    ctx: BotContext
    business: Business
    slot: BusinessStockMarketSlot
    count: number
    page: number
}

export default class BusinessUtils {
    static getEmoji(ctx: BotContext, type: BusinessType) {
        return ctx.t(`business/types/${type}/emoji`)
    }

    static getBuckwheatTitle(ctx: BotContext, type: BusinessType) {
        return ctx.t(`business/types/${type}/buckwheat`)
    }

    static async showMarket({
        ctx,
        business,
        slot,
        count,
        page
    }: ShowMarketOptions) {
        const id = ctx.vars.id
        const chatId = ctx.vars.chatId!

        const balance = await ctx.vars.balance.require()
        const seller = await UserService.get(
            chatId,
            slot.seller
        )

        return {
            key: 'business/message/market/show',
            options: {
                vars: {
                    business,
                    balance: balance.total,
                    slot: {
                        ...slot,
                        max: MAX_BUSINESS_STAKES
                    },
                    selectedCount: count,
                    seller
                },
                keyboard: await businessMarketShowKeyboard(
                    ctx,
                    {
                        id,
                        page,
                        count,
                        slot
                    }
                )
            }
        }
    }
}