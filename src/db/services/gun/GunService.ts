import InventoryItem from "../../entities/items/InventoryItem"
import BaseService from "../base/BaseService"

class GunService extends BaseService<typeof InventoryItem> {
    constructor() {
        super(InventoryItem)
    }
}

export default new GunService()