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

        return [isUpdated, userItem.count! + addValue]
    }

    static async get(id: number, itemId: string): Promise<InventoryItem | null> {
        const items = await this.getAll(id) ?? []

        return InventoryItemsUtils.find(items, itemId)
    }

    static async getAll(id: number): Promise<Items['items'] & {}> {
        const items = await ItemsService.get(id)

        return items.items ?? []
    }

    static async add(id: number, itemId: string): Promise<boolean> {
        const [isUpdated] = await this._update(id, itemId, (item, {type}) => {
            if(item.count! > 0 && type == 'oneInfinity') {
                return {addValue: 0, isUpdated: false}
            }
            return {addValue: 1, isUpdated: true}
        })

        return isUpdated
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
        const users = await ItemsService.getAll()

        for (const {items} of users) {
            const item = InventoryItemsUtils.find(items ?? [], itemId)
            if(item && item.count! > 0) {
                return true
            }
        }

        return false
    }
}