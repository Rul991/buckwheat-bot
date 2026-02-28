import InventoryItem from '../interfaces/schemas/items/InventoryItem'
import { INFINITY_SYMB } from './values/consts'
import Logging from './Logging'
import { InventoryItemCountType, InventoryItemDescription, InventoryItemDescriptionWithId, InventoryItemType, ShowableItem } from './values/types/types'
import FileUtils from './FileUtils'
import StringUtils from './StringUtils'
import ObjectValidator from './ObjectValidator'
import { inventoryItemDescriptionSchema } from './values/schemas'
import { basename } from 'path'
import RandomUtils from './RandomUtils'

type ItemsRecord = Record<string, InventoryItemDescription>
type ItemWithId = InventoryItemDescriptionWithId
type MaterialLevelRecord = Record<number, ItemWithId[]>

export default class InventoryItemsUtils {
    private static _items: ItemsRecord = {}
    private static _materialsByLevel: MaterialLevelRecord = {}

    static get items(): ItemWithId[] {
        return Object.entries(this._items)
            .map(([id, item]) => {
                return {
                    ...item,
                    id
                }
            })
    }

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

    static getRandomMaterial(): ItemWithId | null {
        const rarity = RandomUtils.getRarity(
            this._materialChance,
            this._maxMaterialRarity
        )
        const materials = this._materialsByLevel[rarity] ?? []
        const material = RandomUtils.choose(materials)
        return material
    }

    static getChancePrecents(id: string) {
        const item = this.getItemDescription(id)
        const rarity = item.material?.rarity
        if (!rarity) return 0
        const count = this._materialsByLevel[rarity].length

        return (this._materialChance ** rarity) / count * 100
    }

    static getCountString(count: number, type?: InventoryItemType): string {
        const countString = StringUtils.toFormattedNumber(count)
        const ending = type == 'manyInfinity' ? ` (${INFINITY_SYMB})` : ''
        return `x${countString}${ending}`
    }

    static find(items: InventoryItem[], itemId: string): InventoryItem | null {
        return items.find(v => v.itemId == itemId) ?? null
    }

    static getMaxCount(id: string, countType: InventoryItemCountType) {
        const item = this._items[id]
        if (!item) return 0

        const {
            maxCount: {
                [countType]: maxCount = Infinity
            } = {}
        } = item

        return maxCount
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

    static getTotalCountEveryItems(items?: InventoryItem[]) {
        if(!items || !items.length) return 0

        return items.reduce((prev, { count }) => {
            return prev + (count ?? 0)
        }, 0)
    }

    static getItemDescription(itemId: string): InventoryItemDescription {
        return this._items[itemId] ?? this.getDummyShowableItem()
    }

    static getDummyShowableItem(itemId?: string): ShowableItem {
        if (itemId) {
            const item = this.getItemDescription(itemId)
            return {
                ...item,
                count: 0,
                countText: 'x0',
                itemId
            }
        }

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