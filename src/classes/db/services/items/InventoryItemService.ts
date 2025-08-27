import InventoryItem from '../../../../interfaces/schemas/InventoryItem'
import Items from '../../../../interfaces/schemas/Items'
import InventoryItemsUtils from '../../../../utils/InventoryItemsUtils'
import { AsyncOrSync, InventoryItemDescription, InventoryItemType } from '../../../../utils/values/types'
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

export default class InventoryItemService {
    private static async _update(id: number, itemId: string, callback: UpdateCallback): Promise<[boolean, number]> {
        const itemDescription = InventoryItemsUtils.getItemDescription(itemId)

        if(!itemDescription) {
            return [false, 0]
        }

        const items = await this.getAll(id) ?? []
        const userItem = items
            .find(v => v.itemId == itemId) 
            ?? { itemId, count: 0 }
        
        const {addValue, isUpdated} = await callback(userItem, itemDescription)

        await ItemsRepository.updateOne(id, {
            items: InventoryItemsUtils.add(items, itemId, addValue)
        })

        return [isUpdated, userItem.count!]
    }
    
    private static async _forEach(
        itemId: string, 
        callback: (item: InventoryItem, items: Items) => AsyncOrSync<void | boolean>
    ): Promise<void> {
        const usersItems = await ItemsService.getAll()

        for (const items of usersItems) {
            const item = InventoryItemsUtils.find(items.items ?? [], itemId)
            if(item && await callback(item, items)) {
                return
            }
        }
    }

    static async get(id: number, itemId: string): Promise<InventoryItem | null> {
        const items = await this.getAll(id) ?? []

        return InventoryItemsUtils.find(items, itemId)
    }

    static async getAll(id: number): Promise<Items['items'] & {}> {
        const items = await ItemsService.get(id)

        return items.items ?? []
    }

    static async add(id: number, itemId: string, count = 1): Promise<[boolean, number]> {
        const result = await this._update(id, itemId, (item, {type}) => {
            if(item.count! > 0 && type == 'oneInfinity') {
                return {addValue: 0, isUpdated: false}
            }
            return {addValue: count, isUpdated: true}
        })

        return result
    }

    static async use(id: number, itemId: string): Promise<[boolean, number]> {
        return await this._update(id, itemId, (item, {type}) => {
            const hasItem = (item.count ?? 0) > 0

            if(type == 'consumable') {
                return hasItem ? 
                    {addValue: -1, isUpdated: true} : 
                    {addValue: 0, isUpdated: false}
            }

            else if(hasItem) {
                return { addValue: 0, isUpdated: true }
            }
            
            else {
                return { addValue: 0, isUpdated: false }
            }
        })
    }

    static async anyHas(itemId: string): Promise<boolean> {
        let anyHas = false
        await this._forEach(itemId, item => {
            if(item.count! > 0) {
                anyHas = true
                return true
            }
        })

        return anyHas
    }

    static async getTotalCount(itemId: string): Promise<number> {
        let count = 0
        await this._forEach(itemId, item => {
            count += item.count!
        })

        return count
    }

    static async getOwners(itemId: string): Promise<Owner[]> {
        let owners: Owner[] = []

        await this._forEach(itemId, (item, items) => {
            owners.push({
                id: items.id,
                count: item.count ?? 0
            })
        })

        return owners
    }
}