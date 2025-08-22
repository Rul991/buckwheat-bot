import Messages from '../../../interfaces/schemas/Messages'
import MessagesModel from '../models/MessagesModel'
import IdRepository from './base/IdRepository'

export default new IdRepository<typeof MessagesModel, Messages>(MessagesModel)