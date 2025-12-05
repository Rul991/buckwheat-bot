import Card from '../../../../interfaces/schemas/card/Card'
import CardUtils from '../../../../utils/CardUtils'
import RandomUtils from '../../../../utils/RandomUtils'
import CardRepository from '../../repositories/CardRepository'

export default class {
    static async create(
        raw: Omit<Card, 'id'>
    ) {
        const id = await CardRepository.getMaxId() + 1
        const data = {
            ...raw,
            id
        }

        return await CardRepository.getOrCreate(id, data)
    }

    static async suggest(
        data: Omit<Card, 'id' | 'isSuggested'>
    ) {
        return await this.create({
            ...data,
            isSuggested: true
        })
    }

    static async setSuggested(
        cardId: number,
        isSuggested: boolean
    ) {
        return await CardRepository.updateOne(
            cardId,
            {
                isSuggested
            }
        )
    }

    static async getSuggested() {
        return await CardRepository.findMany({ isSuggested: true })
    }

    static async getAll() {
        return await CardRepository.findMany()
    }

    static async getAvailable() {
        return await CardRepository.findMany({ isSuggested: false })
    }

    static async get(id: number) {
        return await CardRepository.findOne(id)
    }

    static async delete(id: number) {
        return await CardRepository.deleteOne(id)
    }

    static async getRandom() {
        const cards = await this.getAvailable()
        const rarity = CardUtils.getRarity()
        const filteredCards = cards.filter(
            ({rarity: cardRarity}) => cardRarity == rarity
        )

        return RandomUtils.choose(filteredCards)
    }
}