import Work from '../../../interfaces/schemas/user/Work'
import WorkModel from '../models/WorkModel'
import ChatIdRepository from './base/ChatIdRepository'

export default new ChatIdRepository<typeof WorkModel, Work>(WorkModel)