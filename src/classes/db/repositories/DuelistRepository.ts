import Duelist from '../../../interfaces/schemas/duels/Duelist'
import DuelistModel from '../models/DuelistModel'
import ChatIdRepository from './base/ChatIdRepository'

export default new ChatIdRepository<typeof DuelistModel, Duelist>(DuelistModel)