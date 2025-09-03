import User from '../../../interfaces/schemas/User'
import UserModel from '../models/UserModel'
import ChatIdRepository from './base/ChatIdRepository'

export default new ChatIdRepository<typeof UserModel, User>(UserModel)