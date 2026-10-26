import type { BotContext } from "../../../types/bot"
import type { GetRandomItemResult, RandomItemType } from "../../../types/items"
import Item from "../../../utils/items/Item"
import ItemUtils from "../../../utils/items/ItemUtils"
import Logger from "../../../utils/logs/Logger"
import RandomUtils from "../../../utils/math/RandomUtils"
import type Recipe from "../../../utils/recipes/Recipe"
import InventoryItem from "../../entities/items/InventoryItem"
import BaseService from "../base/BaseService"
import LevelService from "../level/LevelService"

type GetOptions<T = any> = {
    chatId: number
    id: number
    item: Item<T>
}

type GetRemainingCountOptions<T = any> =
    & GetOptions<T>
    & {
        transferCount?: number
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

type CraftOptions = {
    chatId: number,
    id: number,
    recipe: Recipe,
    count: number,
}

type CraftResult =
    & GiftResult

type GetRandomItemOptions = {
    chatId: number
    id: number
    type: RandomItemType
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
        return await this._repo.find({
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
            await this._repo.updateOne(
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
        if (count <= 0) {
            return {
                ok: true,
                reason: 'count-less-than-one'
            }
        }

        if (owner == target) {
            return {
                ok: true,
                reason: 'owner-equal-target'
            }
        }

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
            id: target,
            transferCount: count
        })
        if (targetRemainingCount < count) {
            return {
                ok: false,
                reason: 'too-many-items'
            }
        }

        await Promise.all([
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

    async getRemainingCount(options: GetRemainingCountOptions): Promise<number> {
        const {
            chatId,
            item,
            transferCount = 0
        } = options

        const {
            user: userMaxCount,
            chat: chatMaxCount
        } = item.maxCount

        const chatCount = await this.getCountByChat(chatId, item)
        const userCount = await this.getCountByUser(options)

        return Math.min(
            chatMaxCount - chatCount + transferCount,
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

    async getRandomItem({
        chatId,
        id,
        type
    }: GetRandomItemOptions): Promise<GetRandomItemResult> {
        const item = ItemUtils.getRandomItem(type)
        Logger.debug(
            'InventoryItemService.getRandomItem',
            {
                chatId,
                id,
                type,
                item
            }
        )
        if (!item) return {
            item: undefined,
            count: 0
        }

        const remainingCount = await this.getRemainingCount({
            chatId,
            id,
            item
        })
        Logger.debug(
            'InventoryItemService.getRandomItem',
            {
                remainingCount
            }
        )
        if (remainingCount <= 0) {
            return {
                item: undefined,
                count: 0
            }
        }

        const [min, max] = item.drop.lootBoxCount
        const count = type == 'work' ?
            1 :
            RandomUtils.range(min, max)
        const availableCount = Math.min(count, remainingCount)

        Logger.debug(
            'InventoryItemService.getRandomItem',
            {
                count,
                min,
                max,
                availableCount
            }
        )

        return {
            item,
            count: availableCount
        }
    }

    async getItems(chatId: number, id: number, items: Item[]): Promise<Map<number, InventoryItem>> {
        const result = new Map()
        const inventoryItems = await this._repo.find({
            chatId,
            id,
            itemId: {
                $in: items.map(v => v.id)
            }
        })

        for (const inventoryItem of inventoryItems) {
            result.set(
                inventoryItem.itemId,
                inventoryItem
            )
        }

        return result
    }

    async getItemsByChatId(chatId: number, items: Item[]): Promise<Map<number, InventoryItem[]>> {
        const result: Map<number, InventoryItem[]> = new Map()
        const inventoryItems = await this._repo.find({
            chatId,
            itemId: {
                $in: items.map(v => v.id)
            }
        })

        for (const inventoryItem of inventoryItems) {
            const items = result.getOrInsert(
                inventoryItem.id,
                []
            )
            items.push(inventoryItem)
        }

        return result
    }

    async craft({
        chatId,
        id,
        recipe,
        count,
    }: CraftOptions): Promise<CraftResult> {
        if (count <= 0) {
            return {
                ok: false,
                reason: 'invalid-count'
            }
        }

        const resultItem = recipe.result.item
        const resultTotalCount = count * recipe.result.count

        const resultRemainingCount = await this.getRemainingCount({
            chatId,
            id,
            item: resultItem
        })

        if (resultTotalCount > resultRemainingCount) {
            return {
                ok: false,
                reason: 'too-many-items'
            }
        }

        const inventory = await this.getInventory(chatId, id)
        const experience = recipe.getExperience(inventory, count)

        for (const material of recipe.materials) {
            const inventoryItem = inventory.find(v => material.item.id == v.itemId)
            const availableCount = inventoryItem?.count ?? 0
            const requiredCount = material.count * count

            Logger.debug(
                'InventoryItemService.craft',
                {
                    material,
                    inventoryItem,
                    availableCount,
                    requiredCount
                }
            )

            if (availableCount < requiredCount) {
                return {
                    ok: false,
                    reason: 'low-materials'
                }
            }
        }

        for (const material of recipe.materials) {
            const removed = await this.remove({
                chatId,
                id,
                item: material.item,
                count: material.count * count
            })

            if (!removed.ok) {
                return {
                    ok: false,
                    reason: 'low-materials'
                }
            }
        }

        await Promise.all([
            this.add({
                chatId,
                id,
                item: resultItem,
                count: resultTotalCount
            }),
            LevelService.add(
                chatId,
                id,
                experience
            )
        ])

        return {
            ok: true,
            reason: 'done'
        }
    }

    async getAllByChatId(chatId: number): Promise<InventoryItem[]> {
        return await this._repo.find({ chatId })
    }

    async wipe(chatId: number) {
        const items = await this.getAllByChatId(chatId)
        const afterWipeInventoryByUser: InventoryItem[] = []

        for (const inventoryItem of items) {
            const itemId = inventoryItem.itemId
            const item = ItemUtils.get(itemId)
            if (!item || !item.afterWipeItem) continue

            const afterWipeItem = item.afterWipeItem
            const inventoryItemInArray = afterWipeInventoryByUser.find(v => {
                return v.itemId == afterWipeItem.id && v.id == inventoryItem.id
            })

            if (inventoryItemInArray) {
                inventoryItemInArray.count += inventoryItem.count
            }
            else {
                afterWipeInventoryByUser.push(
                    new InventoryItem({
                        chatId: inventoryItem.chatId,
                        id: inventoryItem.id,
                        item: afterWipeItem,
                        count: inventoryItem.count
                    })
                )
            }
        }

        await this.deleteMany({ chatId })
        afterWipeInventoryByUser.length && await this._repo.model.insertMany(afterWipeInventoryByUser)
    }
}

export default new InventoryItemService()