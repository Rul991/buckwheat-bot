import Card from '../../../interfaces/schemas/card/Card'
import CardModel from '../models/CardModel'
import IdRepository from './base/IdRepository'

export default new IdRepository<typeof CardModel, Card>(CardModel)