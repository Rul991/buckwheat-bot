import Cube from '../../../interfaces/schemas/Cube'
import CubeModel from '../models/CubeModel'
import ChatIdRepository from './base/ChatIdRepository'

export default new ChatIdRepository<typeof CubeModel, Cube>(CubeModel)