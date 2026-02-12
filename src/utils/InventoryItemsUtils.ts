import InventoryItem from '../interfaces/schemas/items/InventoryItem'
import { INFINITY_SYMB } from './values/consts'
import Logging from './Logging'
import { InventoryItemDescription, InventoryItemType, ShowableItem } from './values/types/types'
import FileUtils from './FileUtils'
import StringUtils from './StringUtils'
import ObjectValidator from './ObjectValidator'
import { inventoryItemDescriptionSchema } from './values/schemas'
import { basename } from 'path'
import RandomUtils from './RandomUtils'

type ItemsRecord = Record<string, InventoryItemDescription>
type Material = InventoryItemDescription & { id: string }
type MaterialLevelRecord = Record<number, Material[]>

export default class InventoryItemsUtils {
    private static _items: ItemsRecord = {}
    private static _materialsByLevel: MaterialLevelRecord = {}

    private static readonly _materialChance = 0.5
    private static _maxMaterialRarity: number = 0

    private static _isValid(item: InventoryItemDescription) {
        return ObjectValidator.isValidatedObject(item, inventoryItemDescriptionSchema)
    }

    static async setup(): Promise<boolean> {
        const itemFilenames = await FileUtils.readFilesFromResourse('json/items')
        if (!itemFilenames.length) {
            Logging.warn('no items')
            return false
        }

        for (const filename of itemFilenames) {
            const id = basename(filename, '.json')
            const item = await FileUtils.readJsonFromResource<InventoryItemDescription>(
                `json/items/${filename}`
            )

            if (!item) continue
            if (!this._isValid(item)) continue

            this._items[id] = item
            if (item.material) {
                const {
                    rarity
                } = item.material

                if (!this._materialsByLevel[rarity]) {
                    this._materialsByLevel[rarity] = []
                }
                this._materialsByLevel[rarity].push({
                    ...item,
                    id
                })

                this._maxMaterialRarity = Math.max(
                    this._maxMaterialRarity,
                    item.material.rarity
                )
            }
        }

        return true
    }

    static getRandomMaterial(): Material | null {
        const rarity = RandomUtils.getRarity(
            this._materialChance,
            this._maxMaterialRarity
        )
        const materials = this._materialsByLevel[rarity] ?? []
        const material = RandomUtils.choose(materials)
        return material
    }

    static getCountString(count: number, type?: InventoryItemType): string {
        let result: string = 'x'

        const hasItem = count > 0
        const countString = StringUtils.toFormattedNumber(count)

        if (!(type && hasItem)) {
            result += `${countString}`
        }
        else if (type == 'oneInfinity') {
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
        let newItem: InventoryItem[] = []

        if (foundItem) {
            foundItem.count = (foundItem.count ?? 0) + addValue
        }
        else {
            newItem.push({ itemId: itemId, count: addValue })
        }

        const result = [...items, ...newItem]
            .map(({ count, itemId }) => ({ count, itemId }))

        Logging.system(`(${itemId}) new items: `, { newItem, result })
        return result
    }

    static getKeys(): string[] {
        return Object.keys(this._items)
    }

    static getItemDescription(itemId: string): InventoryItemDescription {
        return this._items[itemId] ?? this.getDummyShowableItem()
    }

    static getDummyShowableItem(): ShowableItem {
        return {
            name: 'Предмет',
            type: 'consumable',
            description: '',
            count: 0,
            countText: 'x0',
            itemId: ''
        }
    }
}