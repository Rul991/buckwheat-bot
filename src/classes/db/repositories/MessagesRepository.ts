import Messages from '../../../interfaces/schemas/Messages'
import MessagesModel from '../models/MessagesModel'
import ChatIdRepository from './base/ChatIdRepository'

export default new ChatIdRepository<typeof MessagesModel, Messages>(MessagesModel)