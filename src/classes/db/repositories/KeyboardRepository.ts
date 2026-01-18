import KeyboardSchema from '../../../interfaces/schemas/keyboard/KeyboardSchema'
import KeyboardModel from '../models/KeyboardModel'
import IdRepository from './base/IdRepository'

export default new IdRepository<typeof KeyboardModel, KeyboardSchema>(KeyboardModel)