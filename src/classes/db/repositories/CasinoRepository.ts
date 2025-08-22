import Casino from '../../../interfaces/schemas/Casino'
import CasinoModel from '../models/CasinoModel'
import IdRepository from './base/IdRepository'

export default new IdRepository<typeof CasinoModel, Casino>(CasinoModel)