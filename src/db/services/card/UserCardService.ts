import { EXCHANGE_COUNT, MIN_EXCHANGE_COUNT } from "../../../consts/cards"
import { cardBoxItem, lootboxMaterialItem } from "../../../resources/items/inventory"
import type { BotContext } from "../../../types/bot"
import CardUtils from "../../../utils/card/CardUtils"
import type Card from "../../entities/card/Card"
import UserCard from "../../entities/card/UserCard"
import BaseService from "../base/BaseService"
import InventoryItemService from "../items/InventoryItemService"
import CardService from "./CardService"

type UnpackOptions = {
    chatId: number
    id: number
    ctx: BotContext
}

type UnpackResult =
    | {
        ok: true
        card: Card
        isDuplicate: boolean
    }
    | {
        ok: false
        reason: string
    }

type UserCardOptions = {
    chatId: number
    id: number
    card: number
}

type AddOptions =
    & UserCardOptions
    & {
        count?: number
    }

type ExchangeResult =
    | {
        ok: true
        count: {
            cards: number
            materials: number
        }
        card: Card
    }
    | {
        ok: false
        reason: string
    }

class UserCardService extends BaseService<typeof UserCard> {
    constructor() {
        super(UserCard)
    }

    async getAllByUser(chatId: number, id: number) {
        const userCards = await this._repo.find({
            chatId,
            id,
            count: {
                $gt: 0
            }
        })
        const cards = await CardService.getByIds(
            userCards.map(v => v.card)
        )

        return userCards.sort(
            (a, b) => {
                const aRarity = cards.get(a.card)!.rarity
                const bRarity = cards.get(b.card)!.rarity
                return bRarity - aRarity
            }
        )
    }

    async getStats(chatId: number, id: number) {
        const cards = await this.getAllByUser(chatId, id)
        const unique = cards.length
        const total = cards.reduce(
            (total, card) => {
                return total + card.count
            },
            0
        )
        const max = await CardService.count(false)

        return {
            unique,
            total,
            max,
        }
    }

    async has(filter: UserCardOptions) {
        const result = await this.get(filter)
        return !!(result && result.count > 0)
    }

    async get(filter: UserCardOptions) {
        return await this._repo.findOne(filter)
    }

    async add({ chatId, id, card, count = 1 }: AddOptions) {
        const found = await this._repo.updateOne(
            {
                chatId,
                id,
                card
            },
            {
                $inc: {
                    count
                }
            }
        )
        if (found) {
            return found
        }

        return await this.create(
            new UserCard({
                chatId,
                id,
                card,
                count
            })
        )
    }

    async unpack({
        chatId,
        id,
        ctx
    }: UnpackOptions): Promise<UnpackResult> {
        const rarity = CardUtils.getRarity()

        const useResult = await InventoryItemService.use({
            chatId,
            id,
            item: cardBoxItem,
            ctx
        })
        if (!useResult.ok) {
            return {
                ok: false,
                reason: 'no-card-box'
            }
        }

        const card = await CardService.getRandom(rarity)
        if (!card) {
            return {
                ok: false,
                reason: 'no-card'
            }
        }

        const isDuplicate = await this.has({
            chatId,
            id,
            card: card.id
        })
        await this.add({
            chatId,
            id,
            card: card.id
        })

        return {
            ok: true,
            card,
            isDuplicate
        }
    }

    async getAllByChatId(chatId: number) {
        return await this._repo.find({ chatId })
    }

    async exchange(options: UserCardOptions): Promise<ExchangeResult> {
        const {
            chatId,
            id,
            card: cardId
        } = options

        const userCard = await this.get(options)
        if (!userCard || userCard.count < MIN_EXCHANGE_COUNT) {
            return {
                ok: false,
                reason: 'low-count'
            }
        }

        const card = await CardService.get(cardId)
        if (!card) {
            return {
                ok: false,
                reason: 'no-card'
            }
        }

        const materialsPerCards = CardUtils.getLootboxMaterials(card.rarity)
        const exchangeCount = userCard.count % EXCHANGE_COUNT == 0 ?
            (userCard.count / EXCHANGE_COUNT) - 1 :
            Math.floor(userCard.count / EXCHANGE_COUNT)

        const materials = materialsPerCards * exchangeCount
        const cards = exchangeCount * EXCHANGE_COUNT

        await Promise.all([
            this._repo.updateOne(
                options,
                {
                    $inc: {
                        count: -cards
                    }
                }
            ),
            InventoryItemService.add({
                chatId,
                id,
                item: lootboxMaterialItem,
                count: materials
            })
        ])

        return {
            ok: true,
            count: {
                materials,
                cards
            },
            card
        }
    }
}

export default new UserCardService()