import Items from '../../../interfaces/schemas/items/Items'
import InventoryItem from '../../../interfaces/schemas/items/InventoryItem'
import { createModelWithSubModel } from './modelCreators'

export default createModelWithSubModel<Items, InventoryItem>({
        itemId: { type: String, required: true },
        count: { type: Number, default: 0 }
    },
    inventoryItemSchema => {
        return {
            name: 'Items',
            definition: {
                id: { 
                    type: Number, 
                    required: true, 
                    unique: false
                },
                chatId: {
                    type: Number,
                    required: true,
                    unique: false
                },
                items: { 
                    type: Array, 
                    of: inventoryItemSchema, 
                    default: [] 
                }
            }
        }
    }
)