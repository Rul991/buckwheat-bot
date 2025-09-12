import Marriage from '../../../interfaces/schemas/Marriage'
import MarriageModel from '../models/MarriageModel'
import ChatIdRepository from './base/ChatIdRepository'

export default new ChatIdRepository<typeof MarriageModel, Marriage>(MarriageModel)