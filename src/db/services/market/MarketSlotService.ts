import ItemUtils from "../../../utils/items/ItemUtils"
import MarketSlot from "../../entities/market/MarketSlot"
import BaseService from "../base/BaseService"
import InventoryItemService from "../items/InventoryItemService"
import BalanceService from "../money/BalanceService"

type BuyOptions = {
    chatId: number
    slotId: number
    buyer: number
    count: number
}

type BuyResult =
    & {
        reason: string
    }
    & (
        | {
            ok: true
            count: number
        }
        | {
            ok: false
        }
    )

class MarketSlotService extends BaseService<typeof MarketSlot> {
    constructor() {
        super(MarketSlot)
    }

    async get(slotId: number): Promise<MarketSlot | undefined> {
        return await this._repo.findOne({ id: slotId })
    }

    async getAllByChatId(chatId: number): Promise<MarketSlot[]> {
        return await this._repo.model.find(
            { chatId },
        ).sort({
            itemId: -1,
            count: -1,
            price: 1
        })
    }

    async buy({
        chatId,
        slotId,
        buyer,
        count
    }: BuyOptions): Promise<BuyResult> {
        if (count <= 0) {
            return {
                ok: false,
                reason: 'no-count',
            }
        }

        const slot = await this.get(slotId)
        if (!slot) {
            return {
                ok: false,
                reason: 'slot-not-exist',
            }
        }

        const itemId = slot.itemId
        const item = ItemUtils.get(itemId)
        if (!item) {
            return {
                ok: false,
                reason: 'item-not-exist',
            }
        }

        const seller = slot.seller
        const sellerItemCount = await InventoryItemService.getCountByUser({
            chatId,
            id: seller,
            item
        })
        if (sellerItemCount <= 0) {
            return {
                ok: false,
                reason: 'seller-no-item',
            }
        }

        const buyerRemainingCount = await InventoryItemService.getRemainingCount({
            chatId,
            id: buyer,
            item,
            transferCount: count
        })
        if (buyerRemainingCount <= 0) {
            return {
                ok: false,
                reason: 'buyer-no-remaining-item',
            }
        }

        const availableCount = Math.min(
            count,
            buyerRemainingCount,
            sellerItemCount
        )

        const price = slot.price
        const totalPrice = price * availableCount

        const buyerBalance = await BalanceService.trySpend({
            chatId,
            id: buyer,
            money: totalPrice
        })

        if (!buyerBalance) {
            return {
                ok: false,
                reason: 'buyer-no-money'
            }
        }

        const giftResult = await InventoryItemService.gift({
            chatId,
            owner: seller,
            target: buyer,
            item,
            count: availableCount
        })

        if (!giftResult.ok) {
            await BalanceService.add({
                chatId,
                id: buyer,
                money: totalPrice
            })
            return {
                ok: false,
                reason: 'cant-gift'
            }
        }

        await Promise.all([
            BalanceService.add({
                chatId,
                id: seller,
                money: totalPrice
            }),
            slot.count == availableCount ?
                this._repo.deleteOne({ id: slotId }) :
                this._repo.updateOne(
                    { id: slotId },
                    { $inc: { count: -availableCount } }
                )
        ])

        return {
            ok: true,
            reason: count > availableCount ? 'less-than-need' : 'done',
            count: availableCount,
        }
    }

    async delete(slotId: number): Promise<boolean> {
        const result = await this._repo.deleteOne({ id: slotId })
        return result.deletedCount > 0
    }
}

export default new MarketSlotService()