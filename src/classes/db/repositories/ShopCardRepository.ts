import ShopCard from '../../../interfaces/schemas/card/ShopCard'
import ShopCardModel from '../models/ShopCardModel'
import IdRepository from './base/IdRepository'

export default new IdRepository<typeof ShopCardModel, ShopCard>(ShopCardModel)