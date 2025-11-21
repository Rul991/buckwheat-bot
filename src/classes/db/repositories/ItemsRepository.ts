import Items from '../../../interfaces/schemas/items/Items'
import ItemsModel from '../models/ItemsModel'
import ChatIdRepository from './base/ChatIdRepository'

export default new ChatIdRepository<typeof ItemsModel, Items>(ItemsModel)