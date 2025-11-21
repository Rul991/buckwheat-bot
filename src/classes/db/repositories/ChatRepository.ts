import ChatModel from '../models/ChatModel'
import Chat from '../../../interfaces/schemas/chat/Chat'
import IdRepository from './base/IdRepository'

export default new IdRepository<typeof ChatModel, Chat>(ChatModel)