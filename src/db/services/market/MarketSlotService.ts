import MarketSlot from "../../entities/market/MarketSlot"
import BaseService from "../base/BaseService"

class MarketSlotService extends BaseService<typeof MarketSlot> {
    constructor() {
        super(MarketSlot)
    }
}

export default new MarketSlotService()