import type { BotContext } from "../../../types/bot"
import Item from "../../../utils/items/Item"
import ItemUtils from "../../../utils/items/ItemUtils"
import InventoryItem from "../../entities/items/InventoryItem"
import BaseService from "../base/BaseService"

type GetOptions<T = any> = {
    chatId: number
    id: number
    item: Item<T>
}

type AddOptions<T = any> =
    & GetOptions<T>
    & {
        count?: number
    }

type UseOptions<T = any> =
    & AddOptions<T>
    & {
        ctx: BotContext
        isUseCallback?: boolean
    }
type RemoveOptions = AddOptions<any>
type GiftOptions =
    & Omit<AddOptions<any>, 'id'>
    & {
        owner: number
        target: number
    }

type ItemOperationResult =
    | {
        ok: true
        item: InventoryItem
    }
    | {
        ok: false
    }

type ItemUseResult<T> =
    | {
        ok: false
        reason: string
    }
    | {
        ok: true
        itemResult: T | undefined
    }

type GiftResult = {
    ok: boolean
    reason: string
}

class InventoryItemService extends BaseService<typeof InventoryItem> {
    constructor() {
        super(InventoryItem)
    }

    override async create(item: InventoryItem): Promise<InventoryItem> {
        return this._repo.getOrCreate(
            {
                chatId: item.chatId,
                id: item.id,
                itemId: item.itemId
            },
            item
        )
    }

    async get({
        chatId,
        id,
        item
    }: GetOptions): Promise<InventoryItem | undefined> {
        return await this._repo.findOne({
            chatId,
            id,
            itemId: item.id
        })
    }

    async add({
        chatId,
        id,
        item,
        count = 1
    }: AddOptions): Promise<InventoryItem | undefined> {
        return await this._repo.model.findOneAndUpdate(
            {
                chatId,
                id,
                itemId: item.id
            },
            {
                $inc: {
                    count
                }
            },
            {
                upsert: true,
                lean: true,
                returnDocument: 'after'
            }
        ).exec() ?? undefined
    }

    async getInventory(
        chatId: number,
        id: number
    ): Promise<InventoryItem[]> {
        return await this._repo.model.find({
            chatId,
            id,
            count: {
                $gt: 0
            }
        })
    }

    async remove({
        chatId,
        id,
        item,
        count = 1
    }: RemoveOptions): Promise<ItemOperationResult> {
        const inventoryItem = await this.get({
            chatId,
            id,
            item
        })
        if (!inventoryItem) {
            return {
                ok: false
            }
        }

        const currentCount = inventoryItem.count
        if (currentCount < count) {
            return {
                ok: false
            }
        }

        return {
            ok: true,
            item: (await this._repo.model.findOneAndUpdate(
                {
                    chatId,
                    id,
                    itemId: item.id,
                },
                {
                    $inc: {
                        count: -count
                    }
                },
                {
                    returnDocument: 'after',
                    lean: true,
                }
            ))!
        }
    }

    async use<T>({
        chatId,
        id,
        item,
        count = 1,
        ctx,
        isUseCallback = true
    }: UseOptions<T>): Promise<ItemUseResult<T>> {
        const inventoryItem = await this.get({
            chatId,
            id,
            item
        }) ?? new InventoryItem({ chatId, id, item })

        const currentCount = inventoryItem.count
        if (currentCount < count) {
            return {
                ok: false,
                reason: 'not-enough-count'
            }
        }

        const itemResult: T | undefined = isUseCallback ? await item.use({
            ctx,
            inventoryItem,
            chatId,
            id,
            count
        }) : undefined

        if (item.isConsumable && count != 0) {
            await this._repo.model.updateOne(
                {
                    chatId,
                    id,
                    itemId: item.id,
                },
                {
                    $inc: {
                        count: -count
                    }
                }
            )
        }

        return {
            ok: true,
            itemResult
        }
    }

    async gift({
        chatId,
        owner,
        target,
        item,
        count = 1
    }: GiftOptions): Promise<GiftResult> {
        const options = {
            chatId,
            item,
            count
        }
        const ownerCount = await this.getCountByUser({ ...options, id: owner, })
        if (ownerCount < count) {
            return {
                ok: false,
                reason: 'owner-low-count'
            }
        }

        const targetRemainingCount = await this.getRemainingCount({
            ...options,
            id: target
        })
        if (targetRemainingCount < count) {
            return {
                ok: false,
                reason: 'too-many-items'
            }
        }

        await Promise.allSettled([
            this.remove({
                ...options,
                id: owner
            }),
            this.add({
                ...options,
                id: target
            })
        ])

        return {
            ok: true,
            reason: 'done'
        }
    }

    async getCountByUser(options: GetOptions): Promise<number> {
        const inventoryItem = await this.get(options)
        return inventoryItem?.count ?? 0
    }

    async getCountByChat(chatId: number, item: Item): Promise<number> {
        const items = await this._repo.find({
            chatId,
            itemId: item.id
        })

        return InventoryItem.count(items)
    }

    async hasByUser(options: GetOptions): Promise<boolean> {
        return await this.getCountByUser(options) > 0
    }

    async getRemainingCount(options: GetOptions): Promise<number> {
        const {
            chatId,
            item
        } = options

        const {
            user: userMaxCount,
            chat: chatMaxCount
        } = item.maxCount

        const chatCount = await this.getCountByChat(chatId, item)
        const userCount = await this.getCountByUser(options)

        return Math.min(
            chatMaxCount - chatCount,
            userMaxCount - userCount
        )
    }

    async dev({
        chatId,
        id,
        item
    }: GetOptions): Promise<InventoryItem[]> {
        return await this._repo.find({
            chatId,
            id,
            itemId: item.id
        })
    }

    async getInventoriesByChatId(chatId: number): Promise<Map<number, InventoryItem[]>> {
        const result = new Map<number, InventoryItem[]>()
        const items = await this._repo.find({ chatId })

        for (const item of items) {
            const id = item.id
            const inventory = result.getOrInsert(id, [])
            inventory.push(item)
        }

        return result
    }

    async getRandomItem(chatId: number, id: number) {
        const item = ItemUtils.getRandomItem()
        if (!item) return undefined

        const remainingCount = await this.getRemainingCount({
            chatId,
            id,
            item
        })

        if (remainingCount > 0) {
            return item
        }

        return undefined
    }
}

export default new InventoryItemService()