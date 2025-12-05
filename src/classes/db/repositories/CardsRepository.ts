import Cards from '../../../interfaces/schemas/card/Cards'
import CardsModel from '../models/CardsModel'
import ChatIdRepository from './base/ChatIdRepository'

export default new ChatIdRepository<typeof CardsModel, Cards>(CardsModel)