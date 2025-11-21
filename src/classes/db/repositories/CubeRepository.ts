import Cube from '../../../interfaces/schemas/games/Cube'
import CubeModel from '../models/CubeModel'
import ChatIdRepository from './base/ChatIdRepository'

export default new ChatIdRepository<typeof CubeModel, Cube>(CubeModel)