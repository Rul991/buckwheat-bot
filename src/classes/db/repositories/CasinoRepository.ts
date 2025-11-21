import Casino from '../../../interfaces/schemas/games/Casino'
import CasinoModel from '../models/CasinoModel'
import ChatIdRepository from './base/ChatIdRepository'

export default new ChatIdRepository<typeof CasinoModel, Casino>(CasinoModel)