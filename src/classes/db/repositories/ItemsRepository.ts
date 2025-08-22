import Items from '../../../interfaces/schemas/Items'
import ItemsModel from '../models/ItemsModel'
import IdRepository from './base/IdRepository'

export default new IdRepository<typeof ItemsModel, Items>(ItemsModel)