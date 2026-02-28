import CacheScrollerObjects from '../../../interfaces/schemas/keyboard/CacheScrollerObjects'
import CacheScrollerObjectsModel from '../models/CacheScrollerObjectsModel'
import Repository from './base/Repository'

export default new Repository<typeof CacheScrollerObjectsModel, CacheScrollerObjects>(CacheScrollerObjectsModel)