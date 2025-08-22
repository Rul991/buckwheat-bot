import ChatModel from '../models/ChatModel'
import Chat from '../../../interfaces/schemas/Chat'
import Repository from './base/Repository'

export default new Repository<typeof ChatModel, Chat>(ChatModel)