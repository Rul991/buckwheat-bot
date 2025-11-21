import Ideas from '../../../interfaces/schemas/ideas/Ideas'
import IdeasModel from '../models/IdeasModel'
import Repository from './base/Repository'

export default new Repository<typeof IdeasModel, Ideas>(IdeasModel)