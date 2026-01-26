import InventoryItem from '../../../../interfaces/schemas/items/InventoryItem'
import Items from '../../../../interfaces/schemas/items/Items'
import InventoryItemsUtils from '../../../../utils/InventoryItemsUtils'
import { AsyncOrSync, InventoryItemDescription, InventoryItemType, ShowableItem } from '../../../../utils/values/types/types'
import ItemsRepository from '../../repositories/ItemsRepository'
import ItemsService from './ItemsService'

type UpdateResult = {
    isUpdated: boolean,
    addValue: number
}

type UpdateCallback = (
    userItem: InventoryItem,
    itemDescription: InventoryItemDescription
) => AsyncOrSync<UpdateResult>

type Owner = { id: number, count: number }

type ItemUpdateOptions = {
    chatId: number
    id: number
    itemId: string
    count?: number
}

type _UpdateOptions = ItemUpdateOptions & {
    callback: UpdateCallback
}

export default class InventoryItemService {
    private static async _update({
        chatId,
        id,
        itemId,
        callback
    }: _UpdateOptions): Promise<[boolean, number]> {
        const itemDescription = InventoryItemsUtils.getItemDescription(itemId)

        if (!itemDescription) {
            return [false, 0]
        }

        const items = await this.getAll(chatId, id) ?? []
        const userItem = items
            .find(v => v.itemId == itemId)
            ?? { itemId, count: 0 }

        const { addValue, isUpdated } = await callback(userItem, itemDescription)

        await ItemsRepository.updateOne(chatId, id, {
            items: InventoryItemsUtils.add(items, itemId, addValue)
        })

        return [isUpdated, userItem.count!]
    }

    private static async _forEach(
        chatId: number,
        itemId: string,
        callback: (item: InventoryItem, items: Items) => AsyncOrSync<void | boolean>
    ): Promise<void> {
        const usersItems = await ItemsService.getAll(chatId)

        for (const items of usersItems) {
            const item = InventoryItemsUtils.find(items.items ?? [], itemId)
            if (item && await callback(item, items)) {
                return
            }
        }
    }

    static async has({
        chatId,
        id,
        itemId,
        count: needCount = 1
    }: ItemUpdateOptions): Promise<boolean> {
        const count = await this.getCount(chatId, id, itemId)
        return count >= needCount
    }

    static async getCount(chatId: number, id: number, itemId: string): Promise<number> {
        const item = await this.get(chatId, id, itemId)
        return item?.count ?? 0
    }

    static async get(chatId: number, id: number, itemId: string): Promise<InventoryItem | null> {
        const items = await this.getAll(chatId, id) ?? []

        return InventoryItemsUtils.find(items, itemId)
    }

    static async getAll(chatId: number, id: number): Promise<Items['items'] & {}> {
        const items = await ItemsService.get(chatId, id)

        return items.items ?? []
    }

    static async add(options: ItemUpdateOptions): Promise<[boolean, number]> {
        const {
            count = 1
        } = options

        const result = await this._update({
            ...options,
            callback: (item, { type }) => {
                if (item.count! > 0 && type == 'oneInfinity') {
                    return { addValue: 0, isUpdated: false }
                }
                return { addValue: count, isUpdated: true }
            }
        })

        return result
    }

    static async use(options: ItemUpdateOptions): Promise<[boolean, number]> {
        const {
            count: needCount = 1
        } = options

        return await this._update({
            ...options,
            callback: (item, { type }) => {
                const hasItem = needCount >= 1 && (item.count ?? 0) >= needCount

                if (type == 'consumable') {
                    return hasItem ?
                        { addValue: -needCount, isUpdated: true } :
                        { addValue: 0, isUpdated: false }
                }

                else if (hasItem) {
                    return { addValue: 0, isUpdated: true }
                }

                else {
                    return { addValue: 0, isUpdated: false }
                }
            }
        })
    }

    static async sub(options: ItemUpdateOptions) {
        const {
            count: needCount = 1
        } = options

        return await this._update({
            ...options,
            callback: (item) => {
                const itemCount = item.count ?? 0
                if(needCount > itemCount) {
                    return {
                        addValue: 0,
                        isUpdated: false
                    }
                }
                else {
                    return {
                        addValue: -needCount,
                        isUpdated: true
                    }
                }
            }
        })
    }

    static async anyHas(chatId: number, itemId: string): Promise<boolean> {
        let anyHas = false
        await this._forEach(chatId, itemId, item => {
            if (item.count! > 0) {
                anyHas = true
                return true
            }
        })

        return anyHas
    }

    static async getTotalCount(chatId: number, itemId: string): Promise<number> {
        let count = 0
        await this._forEach(chatId, itemId, item => {
            count += item.count!
        })

        return count
    }

    static async getOwners(chatId: number, itemId: string): Promise<Owner[]> {
        let owners: Owner[] = []

        await this._forEach(chatId, itemId, (item, items) => {
            owners.push({
                id: items.id,
                count: item.count ?? 0
            })
        })

        return owners
    }

    static async showItems(chatId: number, id: number) {
        type Result = ShowableItem

        const items = await this.getAll(chatId, id)
        const descriptions = items
            .reduce((total, item) => {
                const {
                    itemId,
                    count = 0
                } = item

                if (!count) {
                    return total
                }

                const itemDescription = InventoryItemsUtils.getItemDescription(itemId)
                const {
                    type
                } = itemDescription

                total.push({
                    ...itemDescription,
                    countText: InventoryItemsUtils.getCountString(count, type),
                    count,
                    itemId
                })

                return total
            }, [] as Result[])

        return descriptions
    }

    static async showItem(chatId: number, id: number, itemId: string): Promise<ShowableItem> {
        const item = await this.get(
            chatId,
            id,
            itemId
        )

        if (!item) {
            return InventoryItemsUtils.getDummyShowableItem()
        }

        const {
            count = 0
        } = item

        const itemDescription = InventoryItemsUtils.getItemDescription(itemId)
        const {
            type
        } = itemDescription

        return {
            ...itemDescription,
            countText: InventoryItemsUtils.getCountString(count, type),
            count,
            itemId
        }
    }
}