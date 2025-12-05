import InventoryCard from '../../../../interfaces/schemas/card/InventoryCard'
import CardUtils from '../../../../utils/CardUtils'
import CardsRepository from '../../repositories/CardsRepository'
import CardService from './CardService'

type UpdateCardOptions = {
    chatId: number
    id: number
    cardId: number
    foundCardCallback: (card: InventoryCard, index: number, cards: InventoryCard[]) => void
    notFoundCardCallback: (cards: InventoryCard[]) => void
}

export default class {
    private static async _updateCard({
        chatId,
        id,
        cardId,
        foundCardCallback,
        notFoundCardCallback
    }: UpdateCardOptions) {
        const cards = await this.getCards(chatId, id)
        const oldLength = cards.length

        const index = cards.findIndex(
            ({ id }) => id == cardId
        )
        const card = index !== -1 ? cards[index] : undefined

        if (!card) {
            notFoundCardCallback(cards)
        }
        else {
            foundCardCallback(card, index, cards)
        }

        const newLength = cards.length

        if(oldLength != newLength) {
            const cardDescriptions = await CardService.getAvailable()
            cards.sort((a, b) => {
                const aCard = cardDescriptions.find(({id}) => id == a.id)
                const bCard = cardDescriptions.find(({id}) => id == b.id)
                if(!aCard || !bCard) return 0

                return aCard.rarity - bCard.rarity
            })
        }

        await CardsRepository.updateOne(
            chatId,
            id,
            {
                cards
            }
        )

        return cards
    }

    static async get(chatId: number, id: number) {
        return await CardsRepository.getOrCreate(
            chatId,
            id,
            {
                chatId,
                id,
                cards: []
            }
        )
    }

    static async getCards(chatId: number, id: number) {
        const {
            cards
        } = await this.get(chatId, id)

        return cards
    }

    static async getCard(chatId: number, id: number, cardId: number) {
        const cards = await this.getCards(chatId, id)

        return cards.find(card => card.id == cardId)
    }

    static async addCard(chatId: number, id: number, cardId: number) {
        return await this._updateCard({
            chatId,
            id,
            cardId,
            foundCardCallback: card => {
                card.count++
            },
            notFoundCardCallback: cards => {
                cards.push({
                    id: cardId,
                    count: 1
                })
            }
        })
    }

    static async hasCard(chatId: number, id: number, cardId: number) {
        let result = false

        await this._updateCard({
            chatId,
            id,
            cardId,
            foundCardCallback: () => {
                result = true
            },
            notFoundCardCallback: () => {
                result = false
            }
        })

        return result
    }

    static async removeCard(chatId: number, id: number, cardId: number) {
        let result: boolean = true

        await this._updateCard({
            chatId,
            id,
            cardId,
            foundCardCallback: (card, index, cards) => {
                card.count--

                if(card.count <= 0) {
                    cards.splice(index, 1)
                }
            },
            notFoundCardCallback: () => {
                result = false
            }
        })

        return result
    }

    static async getAllCardsWithId(chatId: number) {
        const cards = await CardsRepository.findManyInChat(chatId)

        return cards.map(({cards, id}) => {
            return {
                id,
                cards: cards.length
            }
        })
    }
}