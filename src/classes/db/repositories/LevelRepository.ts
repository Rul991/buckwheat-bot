import Level from '../../../interfaces/schemas/Level'
import LevelModel from '../models/LevelModel'
import IdRepository from './base/IdRepository'

export default new IdRepository<typeof LevelModel, Level>(LevelModel)