import Roulette from '../../../interfaces/schemas/games/Roulette'
import RouletteModel from '../models/RouletteModel'
import ChatIdRepository from './base/ChatIdRepository'

export default new ChatIdRepository<typeof RouletteModel, Roulette>(RouletteModel)