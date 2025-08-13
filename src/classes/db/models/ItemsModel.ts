import { model, Schema } from 'mongoose'
import Items from '../../../interfaces/schemas/Items'
import InventoryItem from '../../../interfaces/schemas/InventoryItem'

type Type = Items

const inventoryItemSchema = new Schema<InventoryItem>({
    itemId: { type: String, required: true },
    count: { type: Number, default: 0 }
})

const itemsSchema = new Schema<Type>(
    {
        id: { type: Number, required: true, unique: true },
        items: { type: Array, of: inventoryItemSchema, default: [] }
    }
)

const ItemsModel = model<Type>('Items', itemsSchema)

export default ItemsModel