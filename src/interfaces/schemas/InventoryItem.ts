import { InventoryItemType } from '../../utils/types'

export default interface InventoryItem {
    itemId: string
    count?: number
}