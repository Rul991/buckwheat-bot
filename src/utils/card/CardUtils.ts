import { CARD_RARITY_CHANCE, MAX_CARD_RARITY } from "../../consts/cards"
import type Card from "../../db/entities/card/Card"
import type ShopCard from "../../db/entities/card/ShopCard"
import type UserCard from "../../db/entities/card/UserCard"
import UserService from "../../db/services/user/UserService"
import type { BotContext } from "../../types/bot"
import RandomUtils from "../math/RandomUtils"

type ShowCollectionOptions = {
    card: Card
    userCard: UserCard
    ctx: BotContext
}

type ShowShopOptions = {
    ctx: BotContext
    chatId: number
    shopCard: ShopCard
    card: Card
    currentCount: number
}

export default class CardUtils {
    private static _rarityToLootboxMaterials = [
        1,
        2,
        4,
        8,
        64,
        128,
    ]

    static getRarity(): number {
        return RandomUtils.rarity(
            CARD_RARITY_CHANCE,
            MAX_CARD_RARITY,
        )
    }

    static getCurrentCount(currentCount: number, shopCard: ShopCard): number {
        return Math.min(currentCount, shopCard.count)
    }

    static getLootboxMaterials(rarity: number) {
        return this._rarityToLootboxMaterials[rarity]!
    }

    static showCollection({
        card,
        userCard,
        ctx
    }: ShowCollectionOptions) {
        return {
            key: 'card/message/show/collection',
            vars: {
                userCard,
                card
            },
            media: {
                type: 'image' as const,
                fileId: card.image
            },
            keyboard: ctx.msg?.reply_markup
        }
    }

    static async showShop({
        shopCard,
        ctx,
        chatId,
        card,
        currentCount: rawCurrentCount
    }: ShowShopOptions) {
        const currentCount = this.getCurrentCount(rawCurrentCount, shopCard)
        return {
            key: 'card/message/show/shop',
            vars: {
                card,
                shopCard,
                seller: await UserService.get(chatId, shopCard.seller),
                currentCount,
                balance: await ctx.vars.balance.require()
            },
            media: {
                type: 'image' as const,
                fileId: card.image
            }
        }
    }
}