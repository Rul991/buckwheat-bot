import User from '../../../interfaces/schemas/User'
import UserModel from '../models/UserModel'
import IdRepository from './base/IdRepository'

export default new IdRepository<typeof UserModel, User>(UserModel)