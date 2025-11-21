import Duel from '../../../interfaces/schemas/duels/Duel'
import DuelModel from '../models/DuelModel'
import IdRepository from './base/IdRepository'

export default new IdRepository<typeof DuelModel, Duel>(DuelModel)