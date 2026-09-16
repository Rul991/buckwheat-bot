import { index, modelOptions, prop } from "@typegoose/typegoose"
import ChatIdEntity from "../base/ChatIdEntity"
import Item from "../../../utils/items/Item"
import ItemUtils from "../../../utils/items/ItemUtils"

type ConstructorOptions =
    & Pick<InventoryItem, 'chatId' | 'id'>
    & Partial<Pick<InventoryItem, 'count'>>
    & {
        item: Item<any>
    }

type CountCallback = (item: InventoryItem) => number

@index(
    {
        chatId: 1,
        id: 1,
        itemId: 1
    },
    {
        unique: true
    }
)
@modelOptions({
    options: {
        disableLowerIndexes: true
    }
})
export default class InventoryItem extends ChatIdEntity {
    static count(inventory: InventoryItem[], callback: CountCallback = item => item.count): number {
        return inventory.reduce(
            (total, item) => {
                return total + callback(item)
            },
            0
        ) 
    }

    static countById(needItem: Item, inventory: InventoryItem[]): number {
        return this.count(
            inventory,
            item => item.itemId == needItem.id ? item.count : 0
        )
    }

    static equal(item: Item, inventoryItem: InventoryItem): boolean {
        return item.id == inventoryItem.itemId
    }

    static dummy(chatId?: number, id?: number, item?: Item): InventoryItem {
        return new InventoryItem({
            chatId: chatId ?? 0,
            id: id ?? 0,
            item: item ?? Item.dummy(),
            count: 0
        })
    }

    static getInventoryPrice(items: InventoryItem[]): number {
        let result = 0
        for (const inventoryItem of items) {
            const itemId = inventoryItem.itemId
            const item = ItemUtils.get(itemId)
            if(!item) continue

            const basePrice = item.basePrice
            const count = inventoryItem.count
            const price = basePrice * count

            result += price
        }
        return result
    }

    static getGuns(inventory: InventoryItem[]): Item[] {
        const result: Item[] = []

        for (const inventoryItem of inventory) {
            const item = ItemUtils.get(inventoryItem.itemId)
            if(!item?.gun) continue

            result.push(item)
        }

        return result
    }

    @prop()
    itemId: number

    @prop()
    count: number

    constructor({
        chatId,
        id,
        item,
        count = 0
    }: ConstructorOptions) {
        super(chatId, id)

        this.itemId = item.id
        this.count = count
    }
}