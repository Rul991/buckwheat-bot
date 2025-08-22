import AntiSpam from '../../../interfaces/schemas/AntiSpam'
import AntiSpamModel from '../models/AntiSpamModel'
import IdRepository from './base/IdRepository'

export default new IdRepository<typeof AntiSpamModel, AntiSpam>(AntiSpamModel)