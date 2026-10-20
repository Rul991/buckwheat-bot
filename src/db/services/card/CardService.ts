import Card from "../../entities/card/Card"
import BaseService from "../base/BaseService"

class CardService extends BaseService<typeof Card> {
    constructor() {
        super(Card)
    }

    async reject(id: number) {
        const result = await this._repo.deleteOne({ id, isSuggested: true })
        return result.deletedCount > 0
    }

    async approve(id: number) {
        return await this._repo.updateOne(
            {
                id
            },
            {
                isSuggested: false
            }
        )
    }

    async getRandom(rarity: number) {
        const [card] = await this._repo.model.aggregate<Card>([
            { $match: { rarity, isSuggested: false } },
            { $sample: { size: 1 } },
        ])
        return card
    }

    async get(id: number) {
        return await this._repo.findOne({ id })
    }

    async getSuggested() {
        return await this._repo.find({ isSuggested: true })
    }

    async count(isSuggested: boolean) {
        return await this._repo.count({ isSuggested })
    }

    async getByIds(ids: number[]) {
        const result: Map<number, Card> = new Map()
        const cards = await this._repo.find({
            id: {
                $in: ids
            }
        })

        for (const card of cards) {
            result.set(
                card.id,
                card
            )
        }

        return result
    }
}

export default new CardService()