import MarketSlot from '../../../../interfaces/schemas/market/MarketSlot'
import MathUtils from '../../../../utils/MathUtils'
import { MAX_MARKET_PRICE, MIN_MARKET_PRICE } from '../../../../utils/values/consts'
import MarketSlotRepository from '../../repositories/MarketSlotRepository'
import CasinoAddService from '../casino/CasinoAddService'
import CasinoGetService from '../casino/CasinoGetService'
import InventoryItemService from '../items/InventoryItemService'

type CreateDoneValues = {
    false: false
    true: true
}
type CreateResult = {
    [K in keyof CreateDoneValues]: BuyResult & {
        done: CreateDoneValues[K]
        result: CreateDoneValues[K] extends true ? MarketSlot : undefined
    }
}[keyof CreateDoneValues]

type BuyResult = {
    reason: string
    done: boolean
}
type BuyOptions = {
    slot: number
    buyer: number
    count: number
}

type GetAllOptions = {
    chatId: number
    itemId?: string
}

export default class {
    static async create(data: Omit<MarketSlot, 'id'>): Promise<CreateResult> {
        const {
            count,
            itemId,
            chatId,
            userId,
            price: rawPrice
        } = data

        const price = MathUtils.clamp(
            Math.floor(rawPrice),
            MIN_MARKET_PRICE,
            MAX_MARKET_PRICE,
        )

        const hasNeedItems = await InventoryItemService.has({
            chatId,
            id: userId,
            itemId,
            count
        })

        if (!hasNeedItems) {
            return {
                done: false,
                reason: 'no-items',
                result: undefined
            }
        }

        return {
            done: true,
            reason: 'created',
            result: await MarketSlotRepository.create({
                ...data,
                price,
                id: await MarketSlotRepository.getMaxId() + 1
            })
        }
    }

    static async get(slotId: number) {
        return await MarketSlotRepository.findOne(
            slotId
        )
    }

    static async getAll({
        chatId,
        itemId
    }: GetAllOptions) {
        return await MarketSlotRepository.findMany(
            {
                chatId,
                ...(itemId ? { itemId } : {})
            }
        )
    }

    static async buy({
        slot: slotId,
        buyer,
        count: needCount
    }: BuyOptions): Promise<BuyResult> {
        const slot = await this.get(slotId)
        if (!slot) return {
            done: false,
            reason: 'no-slot'
        }

        const {
            chatId,
            price,
            count,
            userId: seller,
            itemId
        } = slot

        if (needCount > count) {
            return {
                done: false,
                reason: 'little-product'
            }
        }

        const totalPrice = price * needCount
        const buyerMoney = await CasinoGetService.money(
            chatId,
            buyer
        )

        if (totalPrice > buyerMoney) {
            return {
                done: false,
                reason: 'no-money'
            }
        }

        const partOptions = {
            chatId,
            itemId,
            count: needCount
        }

        const [hasItems] = await InventoryItemService.sub({
            ...partOptions,
            id: seller,
        })

        if (!hasItems) {
            return {
                done: false,
                reason: 'seller-no-items'
            }
        }

        await InventoryItemService.add({
            ...partOptions,
            id: buyer,
        })

        await CasinoAddService.money(chatId, seller, totalPrice)
        await CasinoAddService.money(chatId, buyer, -totalPrice)

        if (needCount == count) {
            await this.delete(slotId)
        }
        else {
            await MarketSlotRepository.updateOne(
                slotId,
                {
                    $inc: {
                        count: -needCount
                    }
                }
            )
        }

        return {
            done: true,
            reason: 'done'
        }
    }

    static async delete(slotId: number) {
        return await MarketSlotRepository.deleteOne(slotId)
    }

    static async wipe(chatId: number) {
        return await MarketSlotRepository.deleteMany({
            chatId
        })
    }
}