import Generators from '../../../interfaces/schemas/generator/Generators'
import GeneratorsModel from '../models/GeneratorsModel'
import ChatIdRepository from './base/ChatIdRepository'

export default new ChatIdRepository<typeof GeneratorsModel, Generators>(GeneratorsModel)