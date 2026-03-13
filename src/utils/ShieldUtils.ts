import InventoryItem from '../interfaces/schemas/items/InventoryItem'
import InventoryItemsUtils from './InventoryItemsUtils'
import { InventoryItemDescriptionWithId, ShieldWithId } from './values/types/items'

export default class {
    private static _shields: Record<string, ShieldWithId> = {}

    static setup(items: InventoryItemDescriptionWithId[]) {
        for (const item of items) {
            const {
                id,
                shield
            } = item

            if(!shield) continue

            this._shields[id] = {
                ...shield,
                id
            }
        }
    }

    static getCoolestShield(items: InventoryItem[]) {
        let result: ShieldWithId | undefined

        for (const item of items) {
            const {
                itemId,
                count = 0
            } = item

            if(count <= 0) continue

            const {
                shield
            } = InventoryItemsUtils.getItemDescription(itemId)

            if(!shield) {
                continue
            }

            if(shield.triggeringChance > (result?.triggeringChance ?? 0)) {
                result = {
                    ...shield,
                    id: itemId
                }
            }
        }

        return result
    }
}