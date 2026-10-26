import BusinessStockMarketSlot from "../../entities/business/BusinessStockMarketSlot"
import BaseService from "../base/BaseService"
import BalanceService from "../money/BalanceService"
import BusinessStockService from "./BusinessStockService"

type GetOptions = {
    chatId: number
    seller: number
    businessId: number
}
type DeleteOptions = GetOptions

type BuyOptions =
    & GetOptions
    & {
        buyer: number
        count: number
    }

type BuyResult =
    | {
        ok: true
        count: number
        slot: BusinessStockMarketSlot | undefined
    }
    | {
        ok: false
        reason: string
    }

class BusinessStockMarketSlotService extends BaseService<typeof BusinessStockMarketSlot> {
    constructor() {
        super(BusinessStockMarketSlot)
    }

    override async create(obj: BusinessStockMarketSlot): Promise<BusinessStockMarketSlot> {
        return await this._repo.updateOrCreate(
            {
                chatId: obj.chatId,
                seller: obj.seller,
                businessId: obj.businessId
            },
            obj
        )
    }

    async get(filter: GetOptions) {
        return await this._repo.findOne(filter)
    }

    async getAllByChatId(chatId: number) {
        return await this._repo.find({ chatId })
    }

    async buy(options: BuyOptions): Promise<BuyResult> {
        const {
            seller,
            count,
            buyer,
            chatId,
            businessId,
        } = options
        const slot = await this.get({
            seller,
            chatId,
            businessId,
        })
        if (!slot) {
            return {
                ok: false,
                reason: 'no-slot'
            }
        }

        const stock = await BusinessStockService.get({
            chatId,
            id: seller,
            businessId
        })
        if (!stock || stock.count <= 0) {
            return {
                ok: false,
                reason: 'no-seller-stock'
            }
        }

        const {
            price
        } = slot
        const availableCount = Math.min(
            count,
            slot.count,
            stock.count
        )

        const totalPrice = price * availableCount
        const isTransfered = await BalanceService.transfer({
            chatId,
            owner: buyer,
            target: seller,
            money: totalPrice
        })
        if (!isTransfered) {
            return {
                ok: false,
                reason: 'no-buyer-money'
            }
        }

        const [newSlot] = await Promise.all([
            availableCount == slot.count ?
                this.delete({ chatId, seller, businessId }) :
                this._repo.updateOne(
                    { chatId, seller, businessId },
                    {
                        $inc: {
                            count: -availableCount
                        }
                    }
                ),
            BusinessStockService.add({
                chatId,
                id: buyer,
                businessId,
                stocks: availableCount
            }),
            BusinessStockService.add({
                chatId,
                id: seller,
                businessId,
                stocks: -availableCount
            })
        ])

        return {
            ok: true,
            count: availableCount,
            slot: typeof newSlot == 'boolean' ? undefined : newSlot
        }
    }

    async delete(filter: DeleteOptions) {
        const result = await this._repo.deleteOne(filter)
        return result.deletedCount > 0
    }
}

export default new BusinessStockMarketSlotService()