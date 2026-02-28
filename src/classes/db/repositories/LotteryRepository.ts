import Lottery from '../../../interfaces/schemas/lottery/Lottery'
import LotteryModel from '../models/LotteryModel'
import IdRepository from './base/IdRepository'

export default new IdRepository<typeof LotteryModel, Lottery>(LotteryModel)