import InventoryItem from '../interfaces/schemas/items/InventoryItem'
import { INFINITY_SYMB } from './values/consts'
import Logging from './Logging'
import { InventoryItemDescription, InventoryItemType } from './values/types/types'
import FileUtils from './FileUtils'
import StringUtils from './StringUtils'
import ObjectValidator from './ObjectValidator'
import { inventoryItemDescriptionSchema } from './values/schemas'

type ItemsRecord = Record<string, InventoryItemDescription>

export default class InventoryItemsUtils {
    private static _items: ItemsRecord = {}

    private static _isValid(item: InventoryItemDescription) {
        return ObjectValidator.isValidatedObject(item, inventoryItemDescriptionSchema)
    }

    static async setup(): Promise<boolean> {
        const items = await FileUtils.readJsonFromResource<ItemsRecord>('json/other/item_descriptions.json')
        if(!items) {
            Logging.error('cant setup inventory item descriptions')
            return false
        }

        for (const key in items) {
            const item = items[key]

            if(this._isValid(item)) {
                this._items[key] = item
            }
        }

        return true
    }

    static getCountString(count: number, type?: InventoryItemType): string {
        let result: string = 'x'
        
        const hasItem = count > 0
        const countString = StringUtils.toFormattedNumber(count)

        if(!(type && hasItem)) {
            result += `${countString}`
        }
        else if(type == 'oneInfinity') {
            result += INFINITY_SYMB
        }
        else {
            const ending = type == 'manyInfinity' ? ` (${INFINITY_SYMB})` : ''

            result += `${countString}${ending}`
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
        
        Logging.system(`(${itemId}) new items: `, result)
        return result
    }

    static getItemDescription(itemId: string): InventoryItemDescription {
        return this._items[itemId] ?? {name: 'Предмет', type: 'consumable'}
    }
}