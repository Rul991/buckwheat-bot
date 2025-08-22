import Ideas from '../../../interfaces/schemas/Ideas'
import IdeasModel from '../models/IdeasModel'
import Repository from './base/Repository'

export default new Repository<typeof IdeasModel, Ideas>(IdeasModel)