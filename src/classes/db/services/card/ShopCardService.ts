import ShopCard from '../../../../interfaces/schemas/card/ShopCard'
import ShopCardRepository from '../../repositories/ShopCardRepository'
import CasinoAddService from '../casino/CasinoAddService'
import CasinoGetService from '../casino/CasinoGetService'
import CardsService from './CardsService'

type BuyResult = {
    isBought: boolean
    reason: string
}

export default class {
    static async create(data: Omit<ShopCard, 'id'>) {
        const id = await ShopCardRepository.getMaxId() + 1

        return await ShopCardRepository.getOrCreate(
            id,
            {
                ...data,
                id
            }
        )
    }

    static async get(id: number): Promise<ShopCard | null> {
        return await ShopCardRepository.findOne(id)
    }

    static async delete(id: number) {
        return await ShopCardRepository.deleteOne(id)
    }

    static async deleteAllInChat(chatId: number) {
        return await ShopCardRepository.deleteMany({ chatId })
    }

    static async buy(id: number, buyer: number): Promise<BuyResult> {
        const shopCard = await this.get(id)
        if (!shopCard) return {
            isBought: false,
            reason: 'no-shop-card'
        }

        const {
            price,
            card,
            chatId,
            seller
        } = shopCard

        const buyerMoney = await CasinoGetService.money(chatId, buyer)

        if (buyerMoney < price) {
            return {
                isBought: false,
                reason: 'no-money'
            }
        }

        const sellerHasCard = await CardsService.hasCard(
            chatId,
            seller,
            card
        )

        if (!sellerHasCard) {
            return {
                isBought: false,
                reason: 'no-card'
            }
        }

        await Promise.all([
            CasinoAddService.money(chatId, seller, price),
            CasinoAddService.money(chatId, buyer, -price),

            CardsService.removeCard(chatId, seller, card),
            CardsService.addCard(chatId, buyer, card),

            this.delete(id),
        ])

        return {
            isBought: true,
            reason: 'bought'
        }
    }

    static async getAllByCardChat(chatId: number, card: number) {
        return await ShopCardRepository.findMany({
            chatId,
            card
        })
    }

    static async getAllByChat(chatId: number) {
        return (await ShopCardRepository.findMany({
            chatId
        }))
            .sort((a, b) => b.card - a.card)
    }

    static async getCardIdsInChat(chatId: number) {
        const result = new Set<number>()
        const cards = await this.getAllByChat(chatId)

        for (const { card } of cards) {
            result.add(card)
        }

        return result
    }
}