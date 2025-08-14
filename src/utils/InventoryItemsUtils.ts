import InventoryItem from '../interfaces/schemas/InventoryItem'
import { INFINITY_SYMB } from './consts'
import Logging from './Logging'
import { InventoryItemDescription, InventoryItemType } from './types'

export default class InventoryItemsUtils {
    private static _items: Record<string, InventoryItemDescription> = {
        infinityCasino: {
            name: 'Беспроигрышное казино',
            type: 'oneInfinity'
        },
        manyCasino: {
            name: 'Улучшение на казино',
            type: 'oneInfinity'
        },
        greedBox: {
            name: 'Шкатулка жадности',
            type: 'manyInfinity'
        },
    }

    static getCountString(count: number, type?: InventoryItemType): string {
        let result: string = 'x'
        const hasItem = count > 0

        if(!(type && hasItem)) {
            result += `${count}`
        }
        else if(type == 'oneInfinity') {
            result += INFINITY_SYMB
        }
        else {
            const ending = type == 'manyInfinity' ? ` (${INFINITY_SYMB})` : ''

            result += `${count}${ending}`
        }

        return result
    }

    static find(items: InventoryItem[], itemId: string): InventoryItem | null {
        return items.find(v => v.itemId == itemId) ?? null
    }

    static add(items: InventoryItem[], itemId: string, addValue: number): InventoryItem[] {
        let foundItem = this.find(items, itemId)
        let newItem: InventoryItem[]

        if(foundItem) {
            newItem = []
            foundItem.count = (foundItem.count ?? 0) + addValue
        }
        else {
            newItem = [{itemId: itemId, count: addValue}]
        }

        const result = [...items, ...newItem]
            .map(({count, itemId}) => ({count, itemId}))
        
        Logging.log(`(${itemId}) new items: `,result)
        return result
    }

    static getItemDescription(itemId: string): InventoryItemDescription {
        return this._items[itemId] ?? {name: 'Предмет', type: 'consumable'}
    }
}