import Level from '../../../interfaces/schemas/user/Level'
import LevelModel from '../models/LevelModel'
import ChatIdRepository from './base/ChatIdRepository'

export default new ChatIdRepository<typeof LevelModel, Level>(LevelModel)