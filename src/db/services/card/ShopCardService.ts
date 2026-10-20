import ShopCard from "../../entities/card/ShopCard"
import type Balance from "../../entities/money/Balance"
import BaseService from "../base/BaseService"
import BalanceService from "../money/BalanceService"
import UserCardService from "./UserCardService"

type BuyOptions = {
    chatId: number
    buyer: number
    slotId: number
    count: number
}

type BuyResult =
    | {
        ok: true
        count: number
        buyerBalance: Balance
    }
    | {
        ok: false
        reason: string
    }

class ShopCardService extends BaseService<typeof ShopCard> {
    constructor() {
        super(ShopCard)
    }

    async get(slotId: number) {
        return await this._repo.findOne({
            id: slotId
        })
    }

    async buy({
        chatId,
        buyer,
        slotId,
        count
    }: BuyOptions): Promise<BuyResult> {
        const shopCard = await this.get(slotId)
        if (!shopCard) {
            return {
                ok: false,
                reason: 'no-shop-card'
            }
        }

        const seller = shopCard.seller
        const cardId = shopCard.card
        const userCard = await UserCardService.get({
            chatId,
            id: seller,
            card: cardId
        })
        if(!userCard || userCard.count <= 0) {
            return {
                ok: false,
                reason: 'no-seller-user-card'
            }
        }

        const availableCount = Math.min(
            count, 
            shopCard.count,
            userCard.count,
        )
        const totalPrice = availableCount * shopCard.price

        const buyerBalance = await BalanceService.trySpend({
            chatId,
            id: buyer,
            money: totalPrice
        })
        if (!buyerBalance) {
            return {
                ok: false,
                reason: 'no-buyer-money'
            }
        }

        await Promise.all([
            UserCardService.add({
                chatId,
                id: buyer,
                card: cardId,
                count: availableCount
            }),
            UserCardService.add({
                chatId,
                id: seller,
                card: cardId,
                count: -availableCount
            }),
            BalanceService.add({
                chatId,
                id: seller,
                money: totalPrice
            }),
            availableCount == shopCard.count ?
                this._repo.deleteOne({
                    id: slotId
                }) :
                this._repo.updateOne(
                    { id: slotId },
                    {
                        $inc: {
                            count: -availableCount
                        }
                    }
                )
        ])

        return {
            ok: true,
            count: availableCount,
            buyerBalance,
        }
    }

    async getAllByChatIdAndCard(chatId: number, cardId: number) {
        return await this._repo.find({
            chatId,
            card: cardId
        })
    }

    async getUniqueCardIds(chatId: number): Promise<number[]> {
        return await this._repo.model.distinct(
            'card',
            {
                chatId
            }
        )
    }
}

export default new ShopCardService()