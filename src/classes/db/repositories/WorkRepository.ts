import Work from '../../../interfaces/schemas/Work'
import WorkModel from '../models/WorkModel'
import IdRepository from './base/IdRepository'

export default new IdRepository<typeof WorkModel, Work>(WorkModel)