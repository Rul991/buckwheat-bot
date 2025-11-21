import InventoryItem from './InventoryItem'

export default interface Items {
    id: number
    chatId: number
    items?: InventoryItem[]
}