import LinkedChat from '../../../interfaces/schemas/LinkedChat'
import LinkedChatModel from '../models/LinkedChatModel'
import IdRepository from './base/IdRepository'

export default new IdRepository<typeof LinkedChatModel, LinkedChat>(LinkedChatModel)