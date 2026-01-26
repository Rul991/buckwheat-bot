import MarketSlot from '../../../interfaces/schemas/market/MarketSlot'
import MarketSlotModel from '../models/MarketSlotModel'
import IdRepository from './base/IdRepository'

export default new IdRepository<typeof MarketSlotModel, MarketSlot>(MarketSlotModel)