import AwardsModel from '../models/AwardsModel'
import Awards from '../../../interfaces/schemas/Awards'
import ChatIdRepository from './base/ChatIdRepository'

export default new ChatIdRepository<typeof AwardsModel, Awards>(AwardsModel)